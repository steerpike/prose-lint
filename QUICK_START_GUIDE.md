# Quick Start: Implementing Your First Check

This guide shows you how to implement a new check in 30 minutes.

---

## Step 1: Study the Original Proselint Check (5 min)

1. Clone proselint if not already done:
```bash
git clone https://github.com/amperser/proselint.git /tmp/proselint
```

2. Find the check you want to implement:
```bash
# Example: Typography dashes
cat /tmp/proselint/proselint/checks/typography/dashes.py
```

3. Note the pattern structure:
   - Look for `existence_check()` calls → use `existenceCheck()` in TypeScript
   - Look for regex patterns → convert to TypeScript regex
   - Note the error messages → adapt for clarity
   - Check for source attributions → preserve in metadata

---

## Step 2: Create the TypeScript Check File (15 min)

**Example: `src/checks/dashes.ts`**

```typescript
/**
 * Typography: Dash Usage
 * Checks for proper use of em dashes, en dashes, and hyphens
 * Source: Based on Chicago Manual of Style and proselint
 */

import { CheckResult } from '../types';
import { existenceCheck } from '../utils';

/**
 * Check for improper dash usage
 */
export function checkDashUsage(text: string): CheckResult[] {
    const patterns = [
        {
            // Double hyphen should be em dash
            pattern: /\b(\w+)--(\w+)\b/g,
            message: 'Use an em dash (—) instead of double hyphens (--)',
            replacement: '$1—$2'
        },
        {
            // Space around em dash (American style prefers no spaces)
            pattern: /\s—\s/g,
            message: 'Em dashes typically have no spaces around them',
            replacement: '—'
        },
        {
            // Hyphen in date range should be en dash
            pattern: /(\d{4})-(\d{4})/g,
            message: 'Use an en dash (–) for ranges, not a hyphen',
            replacement: '$1–$2'
        },
        {
            // Three hyphens should be em dash
            pattern: /---/g,
            message: 'Use an em dash (—) instead of three hyphens (---)',
            replacement: '—'
        }
    ];

    return existenceCheck(
        text,
        patterns,
        'typography.dashes',
        'Chicago Manual of Style'
    );
}

/**
 * Check for inconsistent dash spacing
 */
export function checkDashSpacing(text: string): CheckResult[] {
    const patterns = [
        {
            // En dash without spaces in text (should have spaces)
            pattern: /(\w)–(\w)/g,
            message: 'En dashes in text should have spaces around them',
            replacement: '$1 – $2'
        }
    ];

    return existenceCheck(
        text,
        patterns,
        'typography.dash_spacing',
        'Chicago Manual of Style'
    );
}
```

**Key Points**:
- Import `CheckResult` type and `existenceCheck` utility
- Create one function per sub-check
- Use clear, actionable error messages
- Provide replacements when possible
- Include source attribution
- Use descriptive check IDs (category.specific_check)

---

## Step 3: Register the Check (5 min)

**Create or update: `src/phase5aTypography.ts`**

```typescript
/**
 * Phase 5a: Typography Checks Registration
 */

import { CheckRegistry } from './checkRegistry';
import { checkDashUsage, checkDashSpacing } from './checks/dashes';
import { checkEllipsis } from './checks/ellipsis';
import { checkSymbolUsage } from './checks/symbols';

export function registerPhase5aTypographyChecks(registry: CheckRegistry): void {
    // Dash checks
    registry.registerCheck('typography.dashes', checkDashUsage, {
        name: 'Dash Usage',
        description: 'Checks for proper use of em dashes, en dashes, and hyphens',
        category: 'typography',
        enabled: true,
        severity: 'suggestion',
        source: 'Chicago Manual of Style'
    });

    registry.registerCheck('typography.dash_spacing', checkDashSpacing, {
        name: 'Dash Spacing',
        description: 'Ensures consistent spacing around dashes',
        category: 'typography',
        enabled: true,
        severity: 'suggestion',
        source: 'Chicago Manual of Style'
    });

    // More typography checks...
}
```

---

## Step 4: Initialize in Main Plugin (2 min)

**Update: `main.ts`**

Find the section where checks are registered and add:

```typescript
import { registerPhase5aTypographyChecks } from './src/phase5aTypography';

// In the onload() method, after existing registrations:
registerPhase5aTypographyChecks(this.checkRegistry);
```

---

## Step 5: Test Your Check (3 min)

1. **Rebuild the plugin**:
```bash
npm run dev
```

2. **Create a test document** in Obsidian:
```markdown
# Test Dashes

The project spanned 2020-2024 (should use en dash)
She said--without hesitation--yes (should use em dash)
A well-known author (hyphen is correct)
The range is 1---10 (should use em dash)
```

3. **Open the test document** and check:
   - Real-time highlighting appears
   - Error messages are clear
   - Replacements work correctly
   - Error panel shows the issues

4. **Check settings**:
   - Open Settings → Prose Lint
   - Find "Typography" category
   - Verify your new checks appear
   - Test enable/disable toggles

---

## Common Patterns You'll Use

### 1. Existence Check (Most Common)
Detects unwanted patterns and suggests replacements:

```typescript
import { existenceCheck } from '../utils';

const patterns = [
    {
        pattern: /\bvery\b/gi,
        message: 'Avoid "very" - use stronger adjectives',
        replacement: ''
    }
];

return existenceCheck(text, patterns, 'check.id', 'Source');
```

### 2. Multiple Checks in One File
Return combined results:

```typescript
export function checkAllSpelling(text: string): CheckResult[] {
    return [
        ...checkMisspellings(text),
        ...checkTypos(text),
        ...checkCommonErrors(text)
    ];
}
```

### 3. Case-Insensitive Matching
Use the `i` flag:

```typescript
pattern: /\boccurred\b/gi  // Matches "occurred", "Occurred", "OCCURRED"
```

### 4. Word Boundary Matching
Use `\b` to match whole words only:

```typescript
pattern: /\bthe\b/g  // Matches "the" but not "there" or "other"
```

### 5. Replacement Variables
Use capture groups for smart replacements:

```typescript
{
    pattern: /(\w+)--(\w+)/g,
    message: 'Use em dash',
    replacement: '$1—$2'  // Preserves surrounding words
}
```

---

## Debugging Tips

### Check Not Appearing?
1. Verify registration in main.ts
2. Check for typos in check ID
3. Rebuild plugin: `npm run dev`
4. Restart Obsidian
5. Check browser console for errors (Ctrl+Shift+I)

### Pattern Not Matching?
1. Test regex separately: https://regex101.com/
2. Check for proper escaping: `\.` not `.`
3. Verify flags: `/pattern/gi` for case-insensitive global
4. Add word boundaries if needed: `\b`

### Performance Issues?
1. Avoid overly complex regex
2. Use specific patterns, not greedy matches
3. Test with large documents
4. Profile with: `console.time()` / `console.timeEnd()`

---

## Template: Copy & Modify

```typescript
/**
 * [Category]: [Check Name]
 * [Description]
 * Source: [Attribution]
 */

import { CheckResult } from '../types';
import { existenceCheck } from '../utils';

export function check[Name](text: string): CheckResult[] {
    const patterns = [
        {
            pattern: /pattern1/gi,
            message: 'Clear, actionable message',
            replacement: 'suggestion'
        },
        {
            pattern: /pattern2/gi,
            message: 'Another clear message'
        }
    ];

    return existenceCheck(
        text,
        patterns,
        'category.check_name',
        'Source Attribution'
    );
}
```

---

## Reference: Existing Check Files

Study these for examples:

- **Simple**: `src/checks/testChecks.ts` (basic patterns)
- **Medium**: `src/checks/hedging.ts` (multiple patterns)
- **Complex**: `src/checks/passiveVoice.ts` (advanced logic)
- **Multiple functions**: `src/checks/weaselWords.ts` (several checks)

---

## Quick Reference Commands

```bash
# Development build (watch mode)
npm run dev

# Production build
npm run build

# Run tests
npm test

# Check for errors
npm run lint

# Clean build
rm -rf build/ && npm run build
```

---

## Checklist for Each New Check

- [ ] Created check file in `src/checks/`
- [ ] Implemented check function(s)
- [ ] Added clear error messages
- [ ] Included replacements where applicable
- [ ] Created registration file (or updated existing)
- [ ] Added to main.ts initialization
- [ ] Tested with example text
- [ ] Verified in settings UI
- [ ] Confirmed real-time highlighting
- [ ] Checked error panel display
- [ ] Updated progress in RELEASE_ROADMAP.md

---

## Need Help?

1. **Check existing implementations**: Look at similar checks
2. **Review proselint source**: `/tmp/proselint/proselint/checks/`
3. **Test incrementally**: One pattern at a time
4. **Use console.log**: Debug pattern matching
5. **Check PLAN.md**: Architecture details

---

**You're ready to implement! Start with typography/dashes.ts and work through the roadmap. Good luck! 🚀**
