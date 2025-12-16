/**
 * Spelling: -able vs -ible confusion
 * Words commonly confused between -able and -ible endings
 * 
 * Source: Garner's Modern American Usage, proselint
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for -able/-ible confusion
 */
export function checkAbleIble(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const confusions = [
        'accessable',      // accessible
        'admissable',      // admissible  
        'collectable',     // collectible
        'compatabile',     // compatible
        'comprehensable',  // comprehensible
        'convertable',     // convertible
        'defensable',      // defensible
        'digestable',      // digestible
        'distractable',    // distractible
        'divis able',      // divisible
        'exhaustable',     // exhaustible
        'expressable',     // expressible
        'flexable',        // flexible
        'inadmissable',    // inadmissible
        'indefensable',    // indefensible
        'inexhaustable',   // inexhaustible
        'inflexable',      // inflexible
        'irresistable',    // irresistible
        'permissable',     // permissible
        'resistable',      // resistible
        'reversable',      // reversible
        'sensable',        // sensible
        'suggestable'      // suggestible
    ];

    return existenceCheck(
        text,
        confusions,
        'spelling.able_ible',
        'Spelling confusion: "{}". Check if this should end in -able or -ible.',
        {
            ignoreCase: false,
            severity: 'warning',
            source: 'Garner\'s Modern American Usage'
        }
    );
}
