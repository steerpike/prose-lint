/**
 * Test checks for validating the linting engine
 */

import { existenceCheck } from '../utils';

/**
 * Simple weasel words check - detects "very"
 */
export function checkVery(text: string) {
    return existenceCheck(
        text,
        ['very'],
        'weasel_words.very',
        'Substitute \'damn\' every time you\'re inclined to write \'very\'; your editor will delete it and the writing will be just as it should be.',
        {
            ignoreCase: true,
            severity: 'warning',
            source: 'William Allen White',
            sourceUrl: 'http://bit.ly/1XaMllw'
        }
    );
}

/**
 * Hedging words check
 */
export function checkHedging(text: string) {
    return existenceCheck(
        text,
        [
            'I would argue that',
            ', so to speak',
            'to a certain degree',
            'sort of',
            'kind of',
            'rather',
            'quite',
            'somewhat'
        ],
        'hedging.misc',
        'Hedging detected: "{}". Consider being more direct.',
        {
            ignoreCase: true,
            severity: 'suggestion',
            source: 'Steven Pinker'
        }
    );
}

/**
 * Redundancy check - basic redundant phrases
 */
export function checkRedundancy(text: string) {
    return existenceCheck(
        text,
        [
            'absolutely essential',
            'advance planning',
            'basic fundamentals',
            'close proximity',
            'consensus of opinion',
            'end result',
            'exact same',
            'false pretense',
            'final outcome',
            'free gift',
            'future plans',
            'past history',
            'personal opinion',
            'sudden impulse',
            'unexpected surprise'
        ],
        'redundancy.misc',
        'Redundant phrase detected: "{}". Consider simplifying.',
        {
            ignoreCase: true,
            severity: 'warning'
        }
    );
}
