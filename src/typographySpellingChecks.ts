/**
 * Typography & Spelling Checks Registration
 * Proper formatting and common misspellings
 */

import { CheckRegistry } from './checkRegistry';

// Typography imports
import { checkMultipleHyphens, checkRangeDash } from './checks/dashes';
import { checkEllipsis } from './checks/ellipsis';
import { checkSymbols } from './checks/symbols';

// Spelling imports
import { checkMisspellings } from './checks/misspelling';
import { checkTypos } from './checks/typos';
import { checkAbleIble } from './checks/ableIble';
import { checkErOr } from './checks/erOr';

/**
 * Register all typography and spelling checks
 */
export function registerTypographySpellingChecks(registry: CheckRegistry): void {
    // Typography: Dashes
    registry.registerCheck('typography.dashes.multiple', checkMultipleHyphens, {
        name: 'Multiple Hyphens',
        description: 'Checks for multiple hyphens that should be em dashes (—)',
        category: 'typography',
        enabled: true,
        severity: 'suggestion',
        source: 'Chicago Manual of Style'
    });

    registry.registerCheck('typography.dashes.ranges', checkRangeDash, {
        name: 'Dash in Ranges',
        description: 'Checks for hyphens in ranges that should be en dashes (–)',
        category: 'typography',
        enabled: true,
        severity: 'suggestion',
        source: 'Chicago Manual of Style'
    });

    // Typography: Ellipsis
    registry.registerCheck('typography.ellipsis', checkEllipsis, {
        name: 'Ellipsis',
        description: 'Checks for three dots (...) that should be an ellipsis character (…)',
        category: 'typography',
        enabled: true,
        severity: 'suggestion',
        source: 'Butterick\'s Practical Typography'
    });

    // Typography: Symbols
    registry.registerCheck('typography.symbols', checkSymbols, {
        name: 'Symbols',
        description: 'Checks for alphabetic approximations of symbols (©, ®, ™, ×)',
        category: 'typography',
        enabled: true,
        severity: 'suggestion',
        source: 'Butterick\'s Practical Typography'
    });

    // Spelling: Common Misspellings
    registry.registerCheck('spelling.misspellings', checkMisspellings, {
        name: 'Common Misspellings',
        description: 'Checks for frequently misspelled words',
        category: 'spelling',
        enabled: true,
        severity: 'warning',
        source: 'Garner\'s Modern American Usage'
    });

    // Spelling: Typos
    registry.registerCheck('spelling.typos', checkTypos, {
        name: 'Common Typos',
        description: 'Checks for common typing errors and transpositions',
        category: 'spelling',
        enabled: true,
        severity: 'warning',
        source: 'proselint'
    });

    // Spelling: -able/-ible confusion
    registry.registerCheck('spelling.able_ible', checkAbleIble, {
        name: '-able/-ible Confusion',
        description: 'Checks for words confused between -able and -ible endings',
        category: 'spelling',
        enabled: true,
        severity: 'warning',
        source: 'Garner\'s Modern American Usage'
    });

    // Spelling: -er/-or confusion
    registry.registerCheck('spelling.er_or', checkErOr, {
        name: '-er/-or Confusion',
        description: 'Checks for words confused between -er and -or endings',
        category: 'spelling',
        enabled: true,
        severity: 'warning',
        source: 'Garner\'s Modern American Usage'
    });
}
