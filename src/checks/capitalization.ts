import { ProseLintError } from '../types';

/**
 * Check for incorrect capitalization.
 * Based on proselint/checks/misc/capitalization.py
 * Source: Garner's Modern American Usage
 */
export function checkCapitalization(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Proper nouns that should be capitalized
    const properNouns: [RegExp, string, string][] = [
        [/\bmother nature\b/g, 'mother nature', 'Mother Nature'],
        [/\bstone age\b/g, 'stone age', 'Stone Age'],
        [/\bthe American west\b/g, 'the American west', 'the American West'],
    ];
    
    // Seasons that shouldn't be capitalized (case-sensitive check)
    const seasons: [RegExp, string, string][] = [
        [/\bWinter\b/g, 'Winter', 'winter'],
        [/\bSummer\b/g, 'Summer', 'summer'],
        [/\bFall\b(?! [A-Z])/g, 'Fall', 'fall'], // Avoid "Fall 2024" style dates
        [/\bSpring\b(?! [A-Z])/g, 'Spring', 'spring'],
    ];
    
    // Space age is lowercase
    const spaceAge: [RegExp, string, string][] = [
        [/\bSpace Age\b/g, 'Space Age', 'space age'],
    ];
    
    // Months that should be capitalized
    const months: [RegExp, string, string][] = [
        [/\bjanuary\b/g, 'january', 'January'],
        [/\bfebruary\b/g, 'february', 'February'],
        [/\bmarch\b(?! \d)/g, 'march', 'March'], // Avoid false positives with "march 5 miles"
        [/\bapril\b/g, 'april', 'April'],
        [/\bmay\b(?! be| have| not)/g, 'may', 'May'], // Avoid false positives with "may be"
        [/\bjune\b/g, 'june', 'June'],
        [/\bjuly\b/g, 'july', 'July'],
        [/\baugust\b/g, 'august', 'August'],
        [/\bseptember\b/g, 'september', 'September'],
        [/\boctober\b/g, 'october', 'October'],
        [/\bnovember\b/g, 'november', 'November'],
        [/\bdecember\b/g, 'december', 'December'],
    ];
    
    const allPatterns = [
        ...properNouns.map(p => ({ ...p, type: 'proper noun' })),
        ...seasons.map(p => ({ ...p, type: 'season' })),
        ...spaceAge.map(p => ({ ...p, type: 'space age' })),
        ...months.map(p => ({ ...p, type: 'month' })),
    ];
    
    allPatterns.forEach(({ 0: pattern, 1: wrong, 2: correct, type }) => {
        let match;
        
        while ((match = pattern.exec(text)) !== null) {
            let message = `Incorrect capitalization. '${correct}' is the preferred form.`;
            if (type === 'season') {
                message = `Seasons shouldn't be capitalized. '${correct}' is the preferred form.`;
            }
            
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message,
                check: 'misc.capitalization',
                severity: 'suggestion',
                source: 'Garner\'s Modern American Usage',
                replacements: [correct]
            });
        }
    });
    
    return errors;
}
