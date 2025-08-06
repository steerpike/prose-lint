/**
 * Hedging - Detection of uncertain, tentative language
 * Ported from proselint checks
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for hedging language that undermines confidence
 */
export function checkHedging(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const hedgingPhrases = [
        'I would argue that',
        'I believe that',
        'I think that',
        'I feel that',
        'I suppose',
        'I guess',
        'in my opinion',
        'it seems to me',
        'it appears that',
        'it could be argued',
        'it might be said',
        'it is possible that',
        'it is likely that',
        'perhaps',
        'maybe',
        'possibly',
        'probably',
        'presumably',
        'apparently',
        'seemingly',
        'allegedly',
        'supposedly',
        'sort of',
        'kind of',
        'rather',
        'quite',
        'somewhat',
        'fairly',
        'pretty much',
        'more or less',
        'to some extent',
        'to a certain degree',
        'in a sense',
        'in a way',
        'so to speak',
        'as it were',
        'if you will',
        'to be honest',
        'to tell the truth',
        'frankly speaking',
        'generally speaking',
        'broadly speaking',
        'roughly speaking'
    ];

    return existenceCheck(
        text,
        hedgingPhrases,
        'hedging.misc',
        'Hedging language detected: "{}". Consider stating this more confidently.',
        {
            ignoreCase: true,
            severity: 'suggestion',
            source: 'proselint'
        }
    );
}

/**
 * Check for filler words that weaken writing
 */
export function checkFillerWords(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const fillerWords = [
        'actually',
        'basically',
        'literally',
        'obviously',
        'clearly',
        'certainly',
        'definitely',
        'absolutely',
        'totally',
        'completely',
        'really',
        'truly',
        'honestly',
        'frankly',
        'seriously',
        'essentially',
        'fundamentally',
        'ultimately',
        'particularly',
        'especially',
        'specifically',
        'generally',
        'typically',
        'usually',
        'normally',
        'naturally'
    ];

    return existenceCheck(
        text,
        fillerWords,
        'hedging.filler_words',
        'Filler word detected: "{}". Consider removing for stronger writing.',
        {
            ignoreCase: true,
            severity: 'suggestion',
            source: 'proselint'
        }
    );
}
