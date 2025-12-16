import { ProseLintError } from '../types';

/**
 * Check for gender-biased language.
 * Based on proselint/checks/social_awareness/sexism.py
 * Source: Garner's Modern American Usage
 */
export function checkGenderBias(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Gendered terms that should be neutral
    const genderedTerms: Record<string, string> = {
        'anchorman': 'anchor',
        'anchorwoman': 'anchor',
        'anchorperson': 'anchor',
        'chairman': 'chair',
        'chairwoman': 'chair',
        'chairperson': 'chair',
        'draftman': 'drafter',
        'draftwoman': 'drafter',
        'draftperson': 'drafter',
        'ombudsman': 'ombuds',
        'ombudswoman': 'ombuds',
        'ombudsperson': 'ombuds',
        'tribesman': 'tribe member',
        'tribeswoman': 'tribe member',
        'tribesperson': 'tribe member',
        'policeman': 'police officer',
        'policewoman': 'police officer',
        'policeperson': 'police officer',
        'fireman': 'firefighter',
        'firewoman': 'firefighter',
        'fireperson': 'firefighter',
        'mailman': 'mail carrier',
        'mailwoman': 'mail carrier',
        'mailperson': 'mail carrier',
        'poetess': 'poet',
        'authoress': 'author',
        'waitress': 'waiter',
        'comedienne': 'comedian',
        'confidante': 'confidant',
        'executrix': 'executor',
        'prosecutrix': 'prosecutor',
        'testatrix': 'testator',
    };
    
    // Gendered phrases
    const genderedPhrases: Record<string, string> = {
        'man and wife': 'husband and wife',
        'chairmen and chairs': 'chairs',
        'men and girls': 'men and women',
        'lady lawyer': 'lawyer',
        'woman doctor': 'doctor',
        'female booksalesman': 'bookseller',
        'female airman': 'air pilot',
        'woman scientist': 'scientist',
        'women scientists': 'scientists',
        'herstory': 'history',
        'womyn': 'women',
    };
    
    const allTerms = { ...genderedTerms, ...genderedPhrases };
    
    Object.entries(allTerms).forEach(([wrong, correct]) => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: `Gender bias. Use '${correct}' instead of '${match[0]}'.`,
                check: 'social_awareness.sexism',
                severity: 'warning',
                source: 'Garner\'s Modern American Usage',
                replacements: [correct]
            });
        }
    });
    
    return errors;
}
