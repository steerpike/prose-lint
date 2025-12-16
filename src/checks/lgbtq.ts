import { ProseLintError } from '../types';

/**
 * Check for potentially offensive LGBTQ+ terminology.
 * Based on proselint/checks/social_awareness/lgbtq.py
 * Source: GLAAD Media Reference Guide (9th Edition)
 */
export function checkLGBTQ(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Outdated or potentially offensive terms with preferred alternatives
    const preferredTerms: Record<string, string> = {
        'homosexual man': 'gay man',
        'homosexual men': 'gay men',
        'homosexual woman': 'lesbian',
        'homosexual women': 'lesbians',
        'homosexual people': 'gay people',
        'homosexual couple': 'gay couple',
        'sexual preference': 'sexual orientation',
        'admitted homosexual': 'openly gay',
        'avowed homosexual': 'openly gay',
        'special rights': 'equal rights',
    };
    
    Object.entries(preferredTerms).forEach(([wrong, correct]) => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: `Possibly offensive term. Consider using '${correct}' instead of '${match[0]}'.`,
                check: 'social_awareness.lgbtq.terms',
                severity: 'warning',
                source: 'GLAAD Media Reference Guide',
                replacements: [correct]
            });
        }
    });
    
    // Clearly offensive terms (no replacement suggestions)
    const offensiveTerms = [
        'faggot',
        'dyke',
        'sodomite',
        'homosexual agenda',
        'gay agenda',
        'transvestite',
        'homosexual lifestyle',
        'gay lifestyle',
    ];
    
    offensiveTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: 'Offensive term. Remove it or consider the context.',
                check: 'social_awareness.lgbtq.offensive',
                severity: 'error',
                source: 'GLAAD Media Reference Guide',
                replacements: []
            });
        }
    });
    
    return errors;
}
