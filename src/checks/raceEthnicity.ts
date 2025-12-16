import { ProseLintError } from '../types';

/**
 * Check for euphemistic references to offensive racial language.
 * Based on proselint/checks/social_awareness/nword.py
 * 
 * This check encourages taking responsibility for the words you want to say
 * rather than using euphemisms.
 */
export function checkRaceEthnicity(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Check for euphemistic reference to the n-word
    const nwordPattern = /\bthe n-?word\b/gi;
    let match;
    
    while ((match = nwordPattern.exec(text)) !== null) {
        errors.push({
            start: match.index,
            end: match.index + match[0].length,
            extent: match[0].length,
            message: 'Take responsibility for the words you want to say.',
            check: 'social_awareness.nword',
            severity: 'warning',
            source: 'Proselint',
            replacements: []
        });
    }
    
    return errors;
}
