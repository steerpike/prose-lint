/**
 * Clichés - Detection of overused expressions
 * Ported from proselint checks
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for common clichés
 */
export function checkCliches(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const cliches = [
        'a chip off the old block',
        'a clean slate',
        'a dark and stormy night',
        'a fate worse than death',
        'a fish out of water',
        'a loose cannon',
        'a rolling stone gathers no moss',
        'after all is said and done',
        'all fun and games',
        'all in a day\'s work',
        'all talk, no action',
        'all\'s well that ends well',
        'at the drop of a hat',
        'avoid like the plague',
        'beat a dead horse',
        'better late than never',
        'better safe than sorry',
        'bite off more than you can chew',
        'bite the bullet',
        'bite the dust',
        'blood is thicker than water',
        'break the ice',
        'busy as a bee',
        'by hook or by crook',
        'can\'t judge a book by its cover',
        'caught between a rock and a hard place',
        'compare apples and oranges',
        'crystal clear',
        'cut to the chase',
        'dead as a doornail',
        'don\'t count your chickens before they hatch',
        'don\'t look a gift horse in the mouth',
        'easy as pie',
        'every cloud has a silver lining',
        'few and far between',
        'fit as a fiddle',
        'go the extra mile',
        'good things come to those who wait',
        'happy as a clam',
        'hit the nail on the head',
        'in the heat of the moment',
        'it\'s a piece of cake',
        'kill two birds with one stone',
        'last but not least',
        'like a bull in a china shop',
        'make a long story short',
        'method to my madness',
        'needle in a haystack',
        'once in a blue moon',
        'piece of cake',
        'preaching to the choir',
        'put all your eggs in one basket',
        'raining cats and dogs',
        'read between the lines',
        'sick as a dog',
        'the best thing since sliced bread',
        'the whole nine yards',
        'think outside the box',
        'time heals all wounds',
        'tip of the iceberg',
        'when pigs fly',
        'you can\'t have your cake and eat it too'
    ];

    return existenceCheck(
        text,
        cliches,
        'cliches.misc',
        'Cliché detected: "{}". Consider using original language.',
        {
            ignoreCase: true,
            severity: 'suggestion',
            source: 'proselint'
        }
    );
}

/**
 * Check for "hell" clichés (expressions with "hell")
 */
export function checkHellCliches(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const hellCliches = [
        'all hell broke loose',
        'bat out of hell',
        'come hell or high water',
        'for the hell of it',
        'go to hell',
        'hell bent',
        'hell or high water',
        'like a bat out of hell',
        'mad as hell',
        'raise hell',
        'road to hell is paved with good intentions',
        'snowball\'s chance in hell',
        'sure as hell',
        'what the hell'
    ];

    return existenceCheck(
        text,
        hellCliches,
        'cliches.hell',
        'Hell cliché detected: "{}". Consider more original expression.',
        {
            ignoreCase: true,
            severity: 'suggestion',
            source: 'proselint'
        }
    );
}
