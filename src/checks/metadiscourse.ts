import { ProseLintError } from '../types';

/**
 * Check for excessive metadiscourse.
 * Based on proselint/checks/misc/metadiscourse.py
 * Source: Pinker's "The Sense of Style"
 */
export function checkMetadiscourse(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    const patterns = [
        'The preceeding discussion',
        'The rest of this article',
        'This chapter discusses',
        'The preceding paragraph demonstrated',
        'The previous section analyzed',
        'As mentioned before',
        'As I said earlier',
        'In the next section',
        'Later in this chapter',
    ];
    
    patterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: 'Excessive metadiscourse.',
                check: 'misc.metadiscourse',
                severity: 'suggestion',
                source: 'Pinker\'s "The Sense of Style"',
                replacements: []
            });
        }
    });
    
    return errors;
}
