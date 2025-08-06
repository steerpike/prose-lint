# Tooltip Functionality for Prose Lint

## Overview

The Prose Lint plugin now includes comprehensive tooltip functionality that provides immediate context about detected writing issues when users hover over highlighted text.

## Features

### 🎯 **Intelligent Hover Detection**
- Automatically detects when users hover over highlighted prose lint errors
- Shows tooltips for all error types: errors, warnings, and suggestions
- Maintains proper tooltip positioning relative to cursor

### 📝 **Rich Tooltip Content**
Each tooltip displays:
- **Error Message**: Clear explanation of the writing issue
- **Severity Badge**: Visual indicator (Error/Warning/Suggestion)
- **Rule Information**: Technical rule name and source
- **Suggestions**: Replacement recommendations when available

### 🎨 **Obsidian-Native Styling**
- Uses Obsidian's CSS variables for consistent theming
- Adapts to light/dark mode automatically
- Professional tooltip design with proper shadows and borders
- Smooth fade-in/fade-out animations

### ⚡ **Performance Optimized**
- Lightweight event handling with minimal performance impact
- Efficient position-to-error mapping system
- Smart cleanup to prevent memory leaks
- Debounced positioning updates

## Implementation Details

### Tooltip Display Logic

```typescript
// Tooltip appears when hovering over highlighted elements
.prose-lint-error:hover { cursor: help; }
.prose-lint-warning:hover { cursor: help; }
.prose-lint-suggestion:hover { cursor: help; }
```

### Content Structure

```html
<div class="prose-lint-tooltip">
  <div class="prose-lint-tooltip-header">
    [Error Message]
    <span class="prose-lint-tooltip-severity [severity]">[SEVERITY]</span>
  </div>
  <div>[Suggestions if available]</div>
  <div class="prose-lint-tooltip-rule">[rule.name] ([source])</div>
</div>
```

### Error Type Examples

#### Weasel Words
- **Message**: "very" is a weak intensifier. Consider removing it or using a stronger word.
- **Rule**: `weasel_words.very (proselint)`
- **Severity**: Warning

#### Passive Voice
- **Message**: Passive voice detected: "was written". Consider using active voice for stronger writing.
- **Rule**: `passive_voice.construction (proselint)`
- **Severity**: Suggestion

#### Clichés
- **Message**: Cliché detected: "hell or high water". Consider a more original expression.
- **Rule**: `cliches.hell (proselint)`
- **Severity**: Suggestion

## Configuration

Tooltips are enabled by default but can be controlled via the `showTooltips` option:

```typescript
this.editorLinting = new EditorLinting(this.lintEngine, {
    debounceMs: 1000,
    maxErrors: 50,
    enableRealTime: true,
    highlightErrors: true,
    showTooltips: true  // Enable/disable tooltips
});
```

## Technical Implementation

### Key Components

1. **Tooltip Element Management**
   - Single reusable tooltip element
   - Positioned absolutely relative to viewport
   - Cleaned up on editor changes

2. **Event Handling**
   - `mouseover`: Show tooltip when hovering highlighted text
   - `mouseout`: Hide tooltip with small delay
   - `mousemove`: Update tooltip position dynamically

3. **Position Mapping**
   - Maintains map of text positions to error objects
   - Efficient lookup for tooltip content
   - Cleaned up when highlights are cleared

4. **Smart Positioning**
   - Positions tooltip above cursor by default
   - Adjusts position if tooltip would go off-screen
   - Handles scroll position correctly

### Error-to-Tooltip Mapping

```typescript
private tooltipMap: Map<string, ProseLintError> = new Map();

// Store error by position key
const positionKey = `${start.line}-${start.ch}-${end.line}-${end.ch}`;
this.tooltipMap.set(positionKey, error);
```

## User Experience

### Visual Feedback
- Highlighted text shows `cursor: help` on hover
- Smooth opacity transition (0.2s ease)
- Tooltip appears with subtle upward motion
- Professional styling matches Obsidian theme

### Accessibility
- High contrast text for readability
- Clear visual hierarchy with headers and badges
- Appropriate z-index to appear above all content
- Non-intrusive design that doesn't block editing

### Performance
- Minimal DOM manipulation
- Efficient event delegation
- Memory cleanup on editor changes
- No impact on typing or editing performance

## Testing

Test with documents containing various error types to verify:
- ✅ Tooltips appear on hover over highlighted text
- ✅ Content displays correct error information
- ✅ Positioning works correctly near screen edges
- ✅ Tooltips hide when mouse leaves highlighted area
- ✅ No tooltips appear on normal (non-highlighted) text
- ✅ Performance remains smooth during editing

## Future Enhancements

Potential improvements for future versions:
- **Keyboard Navigation**: Show tooltips with keyboard shortcuts
- **Click Actions**: Allow clicking errors to show detailed fixes
- **Multi-Error Tooltips**: Handle overlapping errors gracefully
- **Custom Tooltip Themes**: User-configurable tooltip appearance
- **Position Preferences**: User choice for tooltip positioning
