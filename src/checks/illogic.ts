import { ProseLintError } from '../types';

/**
 * Check for illogical constructions.
 * Based on proselint/checks/misc/illogic.py
 * Source: Garner's Modern American Usage
 */
export function checkIllogic(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    const patterns = [
        { pattern: /\bpreplan\b/gi, message: "'preplan' is illogical. Use 'plan'.", replacement: 'plan' },
        { pattern: /\bmore than .{1,10} all\b/gi, message: "'more than...all' is illogical." },
        { pattern: /\bappraisal valuations?\b/gi, message: "'appraisal valuation' is redundant. Use 'appraisal' or 'valuation'." },
        { pattern: /\b(?:I|you|he|she|it|they) could care less\b/gi, message: "Use 'couldn't care less' (not 'could care less').", replacement: "couldn't care less" },
        { pattern: /\bleast worst\b/gi, message: "'least worst' is illogical. Use 'best' or 'least bad'." },
        { pattern: /\bmuch-needed gaps?\b/gi, message: "'much-needed gap' is illogical. Gaps are absences." },
        { pattern: /\bmuch-needed voids?\b/gi, message: "'much-needed void' is illogical. Voids are absences." },
        { pattern: /\bno longer requires oxygen\b/gi, message: "'no longer requires oxygen' is illogical (means dead)." },
        { pattern: /\bwithout scarcely\b/gi, message: "'without scarcely' is a double negative." },
        { pattern: /\bto coin a phrase from\b/gi, message: "You can't coin an existing phrase. Did you mean 'borrow'?" },
        { pattern: /\bwithout your collusion\b/gi, message: "It's impossible to defraud yourself. Try 'acquiescence'." },
    ];
    
    patterns.forEach(({ pattern, message, replacement }) => {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: message,
                check: 'misc.illogic',
                severity: 'warning',
                source: 'Garner\'s Modern American Usage',
                replacements: replacement ? [replacement] : []
            });
        }
    });
    
    return errors;
}
