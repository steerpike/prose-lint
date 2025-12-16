/**
 * Spelling: -er vs -or confusion
 * Words commonly confused between -er and -or endings
 * 
 * Source: Garner's Modern American Usage, proselint
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for -er/-or confusion
 */
export function checkErOr(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const confusions = [
        'advisior',        // advisor
        'assesser',        // assessor
        'contributer',     // contributor
        'councillar',      // councilor
        'counsellor',      // counselor (US)
        'defendor',        // defender
        'dependor',        // dependent
        'distributer',     // distributor
        'editour',         // editor
        'investar',        // investor
        'offeror',         // offerer (legal term is offeror, common is offerer)
        'oppresser',       // oppressor
        'possesser',       // possessor
        'professur',       // professor
        'protecter',       // protector
        'reflectar',       // reflector
        'successar',       // successor
        'supervisar',      // supervisor
        'survivour',       // survivor
        'transgressar'     // transgressor
    ];

    return existenceCheck(
        text,
        confusions,
        'spelling.er_or',
        'Spelling confusion: "{}". Check if this should end in -er or -or.',
        {
            ignoreCase: false,
            severity: 'warning',
            source: 'Garner\'s Modern American Usage'
        }
    );
}
