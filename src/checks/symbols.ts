/**
 * Typography: Symbols
 * Checks for proper use of copyright, trademark, and other symbols
 * 
 * Source: Butterick's Practical Typography
 */

import { ProseLintError } from '../types';

/**
 * Check for alphabetic approximations of symbols
 */
export function checkSymbols(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Copyright (c)
    const copyrightRegex = /\(c\)/gi;
    let match;
    while ((match = copyrightRegex.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: '(c) is an alphabetic approximation. Use the copyright symbol ©',
            check: 'typography.symbols.copyright',
            severity: 'suggestion',
            source: 'Butterick\'s Practical Typography',
            replacements: ['©']
        });
    }
    
    // Trademark (tm)
    const trademarkRegex = /\(tm\)/gi;
    while ((match = trademarkRegex.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: '(TM) is an alphabetic approximation. Use the trademark symbol ™',
            check: 'typography.symbols.trademark',
            severity: 'suggestion',
            source: 'Butterick\'s Practical Typography',
            replacements: ['™']
        });
    }
    
    // Registered trademark (r)
    const registeredRegex = /\(r\)/gi;
    while ((match = registeredRegex.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: '(R) is an alphabetic approximation. Use the registered trademark symbol ®',
            check: 'typography.symbols.registered',
            severity: 'suggestion',
            source: 'Butterick\'s Practical Typography',
            replacements: ['®']
        });
    }
    
    // Multiplication symbol
    const multiplicationRegex = /\b(\d+) ?x ?(\d+)\b/gi;
    while ((match = multiplicationRegex.exec(text)) !== null) {
        const replacement = match[1] + ' × ' + match[2];
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Use the multiplication symbol ×, not the letter x',
            check: 'typography.symbols.multiplication',
            severity: 'suggestion',
            source: 'Butterick\'s Practical Typography',
            replacements: [replacement]
        });
    }
    
    return errors;
}
