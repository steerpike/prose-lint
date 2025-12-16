import { ProseLintError } from '../types';

/**
 * Check for preferred forms of words and phrases.
 * Based on proselint/checks/misc/preferred_forms.py
 * Source: Garner's Modern American Usage
 */
export function checkPreferredForms(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Map of wrong form -> correct form
    const preferredForms: Record<string, string> = {
        // Obsolete words
        'imprimature': 'imprimatur',
        
        // Proper nouns
        "hallowe'en": 'Halloween',
        'haloween': 'Halloween',
        'khruschev': 'Khrushchev',
        'klu klux klan': 'Ku Klux Klan',
        'kruschev': 'Khrushchev',
        'pontius pilot': 'Pontius Pilate',
        
        // Plurals
        'hippopotami': 'hippopotamuses',
        'manifesti': 'manifestos',
        'matrixes': 'matrices',
        'mongeese': 'mongooses',
        'narcissuses': 'narcissi',
        'retinae': 'retinas',
        'soprani': 'sopranos',
        'titmouses': 'titmice',
        
        // Hyphenation
        'longstanding': 'long-standing',
        'non-sequitur': 'non sequitur',
        'sans-serif': 'sans serif',
        'sanserif': 'sans serif',
        'tort feasor': 'tortfeasor',
        'tort-feasor': 'tortfeasor',
        
        // Shipping compounds
        'trans-ship': 'transship',
        'trans-shipped': 'transshipped',
        'trans-shipping': 'transshipping',
        'tranship': 'transship',
        'transhipped': 'transshipped',
        'transhipping': 'transshipping',
        
        // Redundancies
        'mental attitude': 'attitude',
        'chief justice of the united states supreme court': 'Chief Justice of the United States',
        
        // Common misspellings/wrong forms
        'a lot of': 'many',
        'each and every': 'each',
        'etc.': 'and so on',
        'in order to': 'to',
        'prior to': 'before',
        'subsequent to': 'after',
    };
    
    Object.entries(preferredForms).forEach(([wrong, correct]) => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: `'${correct}' is the preferred form.`,
                check: 'misc.preferred_forms',
                severity: 'suggestion',
                source: 'Garner\'s Modern American Usage',
                replacements: [correct]
            });
        }
    });
    
    return errors;
}
