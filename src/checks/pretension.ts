import { ProseLintError } from '../types';

/**
 * Check for pretentious jargon.
 * Based on proselint/checks/misc/pretension.py
 * Source: David Ogilvy
 */
export function checkPretension(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    const jargonWords = [
        'reconceptualize',
        'demassification',
        'attitudinally',
        'judgmentally',
        'utilize',
        'leverage',
        'synergy',
        'paradigm shift',
        'best practice',
        'going forward',
    ];
    
    jargonWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: `Jargon words like '${match[0]}' are the hallmarks of a pretentious ass.`,
                check: 'misc.pretension',
                severity: 'suggestion',
                source: 'David Ogilvy',
                replacements: []
            });
        }
    });
    
    return errors;
}
