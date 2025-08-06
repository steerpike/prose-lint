/**
 * Passive Voice Detection
 * Enhanced implementation based on writing-style-checker
 */

import { ProseLintError } from '../types';

/**
 * Interface for passive voice matches
 */
interface PassiveVoiceMatch {
    phrase: string;
    start: number;
    end: number;
    beVerb: string;
    pastParticiple: string;
    context: string;
}

/**
 * Check for passive voice constructions in text
 * Based on pattern: "to be" verb + past participle
 */
export function checkPassiveVoice(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];

    // Irregular past participles from writing-style-checker
    const irregulars = "awoken|been|born|beat|become|begun|bent|beset|bet|bid|bidden|bound|bitten|bled|blown|broken|bred|brought|broadcast|built|burnt|burst|bought|cast|caught|chosen|clung|come|cost|crept|cut|dealt|dug|dived|done|drawn|dreamt|driven|drunk|eaten|fallen|fed|felt|fought|found|fit|fled|flung|flown|forbidden|forgotten|foregone|forgiven|forsaken|frozen|gotten|given|gone|ground|grown|hung|heard|hidden|hit|held|hurt|kept|knelt|knit|known|laid|led|leapt|learnt|left|lent|let|lain|lighted|lost|made|meant|met|misspelt|mistaken|mown|overcome|overdone|overtaken|overthrown|paid|pled|proven|put|quit|read|rid|ridden|rung|risen|run|sawn|said|seen|sought|sold|sent|set|sewn|shaken|shaven|shorn|shed|shone|shod|shot|shown|shrunk|shut|sung|sunk|sat|slept|slain|slid|slung|slit|smitten|sown|spoken|sped|spent|spilt|spun|spit|split|spread|sprung|stood|stolen|stuck|stung|stunk|stridden|struck|strung|striven|sworn|swept|swollen|swum|swung|taken|taught|torn|told|thought|thrived|thrown|thrust|trodden|understood|upheld|upset|woken|worn|woven|wed|wept|wound|won|withheld|withstood|wrung|written";

    // Pattern to match passive voice: "to be" verb + past participle
    const passiveRegex = new RegExp(`\\b(am|are|were|being|is|been|was|be)\\s+(\\w+ed|${irregulars})\\b`, 'gi');

    let match;
    while ((match = passiveRegex.exec(text)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;
        const phrase = match[0];
        const beVerb = match[1];
        const pastParticiple = match[2];

        // Get context around the match
        const contextStart = Math.max(0, start - 25);
        const contextEnd = Math.min(text.length, end + 25);
        const context = text.substring(contextStart, contextEnd);

        // Some heuristics to reduce false positives
        if (isLikelyPassiveVoice(phrase, beVerb, pastParticiple, context)) {
            errors.push({
                start,
                end,
                extent: end - start,
                message: `Passive voice detected: "${phrase}". Consider using active voice for stronger writing.`,
                check: 'passive_voice.construction',
                severity: 'suggestion',
                source: 'proselint',
                replacements: [
                    `Consider rewriting to use active voice instead of "${phrase}"`
                ]
            });
        }
    }

    return errors;
}

/**
 * Apply heuristics to determine if a match is likely passive voice
 * This helps reduce false positives
 */
function isLikelyPassiveVoice(phrase: string, beVerb: string, pastParticiple: string, context: string): boolean {
    // Skip some common false positives
    const falsePositives = [
        // Common "to be" + adjective patterns that aren't passive
        /\b(is|are|was|were)\s+(good|bad|nice|fine|okay|great|terrible|awful|amazing|wonderful|horrible)\b/i,
        // "to be" + location/state
        /\b(is|are|was|were)\s+(here|there|home|away|present|absent|available|ready)\b/i,
        // Past participles used as adjectives
        /\b(is|are|was|were)\s+(concerned|interested|excited|surprised|pleased|worried|tired|confused)\b/i
    ];

    for (const pattern of falsePositives) {
        if (pattern.test(phrase)) {
            return false;
        }
    }

    // If past participle ends in -ed, it's likely passive voice
    if (pastParticiple.endsWith('ed')) {
        return true;
    }

    // For irregular past participles, we're more confident it's passive voice
    return true;
}

/**
 * Advanced passive voice check with better context analysis
 */
export function checkPassiveVoiceAdvanced(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];

    // More sophisticated patterns for passive voice detection
    const patterns = [
        // Standard passive: be + past participle
        {
            regex: /\b(am|is|are|was|were|being|been|be)\s+([\w]+ed|awoken|beaten|become|begun|bent|beset|bet|bid|bidden|bound|bitten|bled|blown|broken|bred|brought|broadcast|built|burnt|burst|bought|cast|caught|chosen|clung|come|cost|crept|cut|dealt|dug|dived|done|drawn|dreamt|driven|drunk|eaten|fallen|fed|felt|fought|found|fit|fled|flung|flown|forbidden|forgotten|foregone|forgiven|forsaken|frozen|gotten|given|gone|ground|grown|hung|heard|hidden|hit|held|hurt|kept|knelt|knit|known|laid|led|leapt|learnt|left|lent|let|lain|lighted|lost|made|meant|met|misspelt|mistaken|mown|overcome|overdone|overtaken|overthrown|paid|pled|proven|put|quit|read|rid|ridden|rung|risen|run|sawn|said|seen|sought|sold|sent|set|sewn|shaken|shaven|shorn|shed|shone|shod|shot|shown|shrunk|shut|sung|sunk|sat|slept|slain|slid|slung|slit|smitten|sown|spoken|sped|spent|spilt|spun|spit|split|spread|sprung|stood|stolen|stuck|stung|stunk|stridden|struck|strung|striven|sworn|swept|swollen|swum|swung|taken|taught|torn|told|thought|thrived|thrown|thrust|trodden|understood|upheld|upset|woken|worn|woven|wed|wept|wound|won|withheld|withstood|wrung|written)\b/gi,
            message: 'Passive voice detected'
        },
        // Get passive: get + past participle
        {
            regex: /\b(get|gets|got|getting)\s+([\w]+ed|beaten|broken|caught|chosen|done|driven|eaten|forgotten|given|hidden|hit|known|made|paid|seen|sold|spoken|stolen|taken|told|written)\b/gi,
            message: 'Passive voice with "get" detected'
        }
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.regex.exec(text)) !== null) {
            const start = match.index;
            const end = match.index + match[0].length;
            const phrase = match[0];

            // Apply context-based filtering
            const contextStart = Math.max(0, start - 50);
            const contextEnd = Math.min(text.length, end + 50);
            const context = text.substring(contextStart, contextEnd);

            if (isValidPassiveConstruction(phrase, context)) {
                errors.push({
                    start,
                    end,
                    extent: end - start,
                    message: `${pattern.message}: "${phrase}". Consider rewriting in active voice.`,
                    check: 'passive_voice.advanced',
                    severity: 'suggestion',
                    source: 'proselint',
                    replacements: [
                        'Rewrite in active voice by making the actor the subject',
                        'Consider who or what is performing the action'
                    ]
                });
            }
        }
    }

    return errors;
}

/**
 * Validate that a potential passive construction is actually passive voice
 */
function isValidPassiveConstruction(phrase: string, context: string): boolean {
    // Skip if it's clearly not passive voice
    const skipPatterns = [
        // "To be" + adjective
        /\b(is|are|was|were|am|be|being|been)\s+(happy|sad|angry|excited|tired|ready|available|present|absent|good|bad|nice|fine|great|small|large|big|little|old|new|young|high|low|long|short|fast|slow|hot|cold|warm|cool|wet|dry|clean|dirty|easy|hard|difficult|simple|complex|important|interesting|boring|funny|serious|careful|careless|helpful|useful|useless)\b/i,
        // "To be" + location/direction
        /\b(is|are|was|were|am|be|being|been)\s+(here|there|home|away|up|down|in|out|on|off|under|over|inside|outside|upstairs|downstairs)\b/i,
        // Common false positives
        /\b(get|gets|got|getting)\s+(up|down|in|out|on|off|home|here|there|ready|dressed|undressed)\b/i
    ];

    for (const pattern of skipPatterns) {
        if (pattern.test(phrase)) {
            return false;
        }
    }

    return true;
}
