/**
 * Typography: Dash Usage
 * Checks for proper use of em dashes (—), en dashes (–), and hyphens (-)
 * 
 * Sources: 
 * - Chicago Manual of Style
 * - Butterick's Practical Typography
 */

import { ProseLintError } from '../types';

/**
 * Check for multiple hyphens that should be em dash
 */
export function checkMultipleHyphens(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Three hyphens
    const threeHyphensRegex = /---/g;
    let match;
    while ((match = threeHyphensRegex.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Use an em dash (—) instead of three hyphens (---)',
            check: 'typography.dashes.three_hyphens',
            severity: 'suggestion',
            source: 'Butterick\'s Practical Typography',
            replacements: ['—']
        });
    }
    
    // Two hyphens between words
    const twoHyphensRegex = /(\w)--(\w)/g;
    while ((match = twoHyphensRegex.exec(text)) !== null) {
        const replacement = match[1] + '—' + match[2];
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Use an em dash (—) instead of two hyphens (--)',
            check: 'typography.dashes.two_hyphens',
            severity: 'suggestion',
            source: 'Chicago Manual of Style',
            replacements: [replacement]
        });
    }
    
    // Two hyphens with spaces
    const twoHyphensSpaceRegex = /\s--\s/g;
    while ((match = twoHyphensSpaceRegex.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Use an em dash (—) instead of two hyphens (--)',
            check: 'typography.dashes.two_hyphens_spaced',
            severity: 'suggestion',
            source: 'Chicago Manual of Style',
            replacements: [' — ', '—']
        });
    }
    
    return errors;
}

/**
 * Check for hyphen in ranges that should be en dash
 */
export function checkRangeDash(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Year ranges: 2020-2024
    const yearRangeRegex = /(\d{4})-(\d{4})/g;
    let match;
    while ((match = yearRangeRegex.exec(text)) !== null) {
        const replacement = match[1] + '–' + match[2];
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Use an en dash (–) for year ranges, not a hyphen',
            check: 'typography.dashes.year_range',
            severity: 'suggestion',
            source: 'Chicago Manual of Style',
            replacements: [replacement]
        });
    }
    
    // Number ranges: 10-20
    const numberRangeRegex = /\b(\d+)-(\d+)\b/g;
    while ((match = numberRangeRegex.exec(text)) !== null) {
        // Skip year ranges (already handled above)
        if (match[1].length === 4 && match[2].length === 4) {
            continue;
        }
        const replacement = match[1] + '–' + match[2];
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Use an en dash (–) for number ranges, not a hyphen',
            check: 'typography.dashes.number_range',
            severity: 'suggestion',
            source: 'Chicago Manual of Style',
            replacements: [replacement]
        });
    }
    
    return errors;
}
