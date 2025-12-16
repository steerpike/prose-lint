import { ProseLintError } from '../types';

/**
 * Check for missing hyphens in phrasal adjectives.
 * Based on proselint/checks/misc/phrasal_adjectives.py
 * Source: Garner's Modern American Usage
 */
export function checkPhrasalAdjectives(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    
    // Check for unnecessary hyphens after -ly adverbs
    const lyPattern = /\s[^\s-]+ly-/g;
    let match;
    
    while ((match = lyPattern.exec(text)) !== null) {
        errors.push({
            start: match.index + 1, // Skip leading space
            end: match.index + match[0].length,
            extent: match[0].length - 1,
            message: 'No hyphen is necessary in phrasal adjectives with an adverb ending in -ly.',
            check: 'misc.phrasal_adjectives.ly',
            severity: 'suggestion',
            source: 'Garner\'s Modern American Usage',
            replacements: []
        });
    }
    
    // Common phrasal adjectives that need hyphens
    const phrasalAdjectives: Record<string, string> = {
        'across the board discounts': 'across-the-board discounts',
        'big ticket item': 'big-ticket item',
        'class action lawyer': 'class-action lawyer',
        'cut and dried': 'cut-and-dried',
        'face to face meeting': 'face-to-face meeting',
        'fixed rate mortgage': 'fixed-rate mortgage',
        'for profit': 'for-profit',
        'free range chicken': 'free-range chicken',
        'head on collision': 'head-on collision',
        'head to head': 'head-to-head',
        'health care coverage': 'health-care coverage',
        'high school student': 'high-school student',
        'hit and run': 'hit-and-run',
        'long term care': 'long-term care',
        'low income housing': 'low-income housing',
        'mom and pop shop': 'mom-and-pop shop',
        'no fault': 'no-fault',
        'non profit': 'non-profit',
        'one way': 'one-way',
        'open and shut case': 'open-and-shut case',
        'open source': 'open-source',
        'real estate': 'real-estate',
        'right wing': 'right-wing',
        'round trip': 'round-trip',
        'second largest': 'second-largest',
        'small business': 'small-business',
        'state sponsored': 'state-sponsored',
        'time honored': 'time-honored',
        'well known': 'well-known',
        'well publicized': 'well-publicized',
        'zero sum game': 'zero-sum game',
        
        // Quarter references
        'first quarter gain': 'first-quarter gain',
        'first quarter loss': 'first-quarter loss',
        'second quarter gain': 'second-quarter gain',
        'second quarter loss': 'second-quarter loss',
        'third quarter gain': 'third-quarter gain',
        'third quarter loss': 'third-quarter loss',
        'fourth quarter gain': 'fourth-quarter gain',
        'fourth quarter loss': 'fourth-quarter loss',
        
        // Part harmony
        'three part harmony': 'three-part harmony',
        'four part harmony': 'four-part harmony',
    };
    
    Object.entries(phrasalAdjectives).forEach(([wrong, correct]) => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            errors.push({
                start: match.index,
                end: match.index + match[0].length,
                extent: match[0].length,
                message: `Hyphenate '${match[0]}', a phrasal adjective, as '${correct}'.`,
                check: 'misc.phrasal_adjectives',
                severity: 'suggestion',
                source: 'Garner\'s Modern American Usage',
                replacements: [correct]
            });
        }
    });
    
    return errors;
}
