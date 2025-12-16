import { ProseLintError } from '../types';

/**
 * Check for excessive apologizing in writing.
 * Based on proselint/checks/misc/apologizing.py
 * Source: Pinker's "The Sense of Style"
 */
export function checkApologizing(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    const patterns = [
        'More research is needed',
        'I\'m sorry to say',
        'Unfortunately,',
        'Regrettably,',
    ];
    
    patterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: 'Excessive apologizing.',
                check: 'misc.apologizing',
                severity: 'suggestion',
                source: 'Pinker\'s "The Sense of Style"',
                replacements: []
            });
        }
    });
    
    return errors;
}
