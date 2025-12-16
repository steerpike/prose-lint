/**
 * Spelling: Common Typos
 * Keyboard proximity typos and transposition errors
 * 
 * Source: proselint
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for common typing errors
 */
export function checkTypos(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const typos = [
        'teh',           // the
        'adn',           // and
        'taht',          // that
        'thier',         // their
        'recieved',      // received
        'beleive',       // believe
        'acheive',       // achieve
        'occassion',     // occasion
        'occassional',   // occasional
        'embarass',      // embarrass
        'harrass',       // harass
        'wierd',         // weird
        'freind',        // friend
        'guarentee',     // guarantee
        'existance',     // existence
        'persistant',    // persistent
        'perseverence',  // perseverance
        'priviledge',    // privilege
        'publically',    // publicly
        'siezure'        // seizure
    ];

    return existenceCheck(
        text,
        typos,
        'spelling.typos',
        'Possible typo: "{}". Did you mean something else?',
        {
            ignoreCase: false,
            severity: 'warning',
            source: 'proselint'
        }
    );
}
