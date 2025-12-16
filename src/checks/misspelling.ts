/**
 * Spelling: Common Misspellings
 * Top common misspellings with corrections
 * 
 * Source: Garner's Modern American Usage, proselint
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for common misspellings
 */
export function checkMisspellings(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const misspellings = [
        'alot',           // a lot
        'accomodation',   // accommodation
        'arguement',      // argument
        'calender',       // calendar
        'definately',     // definitely
        'enviroment',     // environment
        'explaination',   // explanation
        'goverment',      // government
        'independant',    // independent
        'maintainance',   // maintenance
        'neccessary',     // necessary
        'occured',        // occurred
        'occurence',      // occurrence
        'recomend',       // recommend
        'recieve',        // receive
        'seperate',       // separate
        'tommorrow',      // tomorrow
        'untill',         // until
        'wierd',          // weird
        'wellcome'        // welcome
    ];

    return existenceCheck(
        text,
        misspellings,
        'spelling.common_misspellings',
        'Common misspelling: "{}". Check spelling.',
        {
            ignoreCase: false,
            severity: 'warning',
            source: 'Garner\'s Modern American Usage'
        }
    );
}
