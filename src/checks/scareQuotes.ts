import { ProseLintError } from '../types';

/**
 * Check for misuse of scare quotes.
 * Based on proselint/checks/misc/scare_quotes.py
 * Source: Pinker's "The Sense of Style"
 */
export function checkScareQuotes(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Pattern for inappropriate scare quotes
    const regex = /\bthe 'take-home message'\b/gi;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Misuse of \'scare quotes\'. Delete them.',
            check: 'misc.scare_quotes',
            severity: 'suggestion',
            source: 'Pinker\'s "The Sense of Style"',
            replacements: ['the take-home message']
        });
    }
    
    return errors;
}
