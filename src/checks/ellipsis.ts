/**
 * Typography: Ellipsis
 * Checks for proper ellipsis formatting
 * 
 * Source: Butterick's Practical Typography
 */

import { ProseLintError } from '../types';

/**
 * Check for three dots that should be an ellipsis character
 */
export function checkEllipsis(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Three periods in a row
    const threeDotsRegex = /\.\.\./g;
    let match;
    while ((match = threeDotsRegex.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: '"..." is an approximation. Use the ellipsis symbol "…"',
            check: 'typography.ellipsis.approximation',
            severity: 'suggestion',
            source: 'Butterick\'s Practical Typography',
            replacements: ['…']
        });
    }
    
    return errors;
}
