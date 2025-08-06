/**
 * Weasel Words - Detection of weak, vague language
 * Ported from proselint checks
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for the word "very" - a common weak intensifier
 */
export function checkVery(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    return existenceCheck(
        text,
        ['very'],
        'weasel_words.very',
        '"Very" is a weak intensifier. Consider removing it or using a stronger word.',
        {
            severity: 'warning',
            source: 'proselint'
        }
    );
}

/**
 * Check for various weasel words - vague, imprecise language
 */
export function checkWeaselWords(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const weaselWords = [
        'a number of',
        'all things being equal',
        'as a matter of fact',
        'at the end of the day',
        'by and large',
        'for all intents and purposes',
        'in a very real sense',
        'in fact',
        'in general',
        'in my opinion',
        'it could be argued that',
        'it goes without saying',
        'it has been shown',
        'it is believed',
        'it is clear that',
        'it is generally accepted',
        'it is important to note',
        'it is interesting to note',
        'it is known that',
        'it is obvious that',
        'it is recognized that',
        'it is worth noting',
        'it may be said',
        'it might be argued',
        'it should be noted',
        'needless to say',
        'to be sure',
        'without a doubt'
    ];

    return existenceCheck(
        text,
        weaselWords,
        'weasel_words.misc',
        'Weasel word detected: "{}". Consider being more specific.',
        {
            ignoreCase: true,
            severity: 'warning',
            source: 'proselint'
        }
    );
}

/**
 * Check for "there is/are" constructions that often indicate weak writing
 */
export function checkThereIs(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const patterns = [
        'there is',
        'there are',
        'there was',
        'there were',
        'there will be',
        'there would be',
        'there has been',
        'there have been',
        'there had been'
    ];

    return existenceCheck(
        text,
        patterns,
        'weasel_words.there_is',
        '"There is/are" construction detected: "{}". Consider a more direct approach.',
        {
            ignoreCase: true,
            severity: 'suggestion',
            source: 'proselint'
        }
    );
}
