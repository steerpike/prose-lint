/**
 * Redundancy - Detection of redundant phrases and RAS syndrome
 * Ported from proselint checks
 */

import { existenceCheck } from '../utils';
import { ProseLintError } from '../types';

/**
 * Check for redundant phrases
 */
export function checkRedundancy(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const redundantPhrases = [
        'absolutely essential',
        'absolutely necessary',
        'advance planning',
        'advance warning',
        'basic fundamentals',
        'close proximity',
        'completely finished',
        'consensus of opinion',
        'end result',
        'exact same',
        'false pretense',
        'final outcome',
        'free gift',
        'future plans',
        'gather together',
        'general consensus',
        'invited guest',
        'join together',
        'new innovation',
        'past history',
        'personal opinion',
        'plan ahead',
        'sudden impulse',
        'sum total',
        'true fact',
        'unexpected surprise',
        'usual custom'
    ];

    return existenceCheck(
        text,
        redundantPhrases,
        'redundancy.misc',
        'Redundant phrase detected: "{}". Consider simplifying.',
        {
            ignoreCase: true,
            severity: 'warning',
            source: 'proselint'
        }
    );
}

/**
 * Check for RAS syndrome (Redundant Acronym Syndrome syndrome)
 * Examples: "ATM machine", "PIN number", "HIV virus"
 */
export function checkRasSyndrome(text: string): Omit<ProseLintError, 'line' | 'column'>[] {
    const rasPatterns = [
        'ATM machine',
        'PIN number',
        'HIV virus',
        'LCD display',
        'LED light',
        'GPS system',
        'URL link',
        'HTML markup',
        'PDF format',
        'SAT test',
        'GPA average',
        'RPM rate',
        'MHz frequency',
        'RAM memory',
        'ROM memory',
        'USB port',
        'WiFi network',
        'CEO officer',
        'CTO officer',
        'CFO officer',
        'DVD disc',
        'CD disc',
        'FAQ questions',
        'RSVP reply',
        'ISBN number',
        'VIN number',
        'UPC code',
        'ZIP code',
        'SSN number',
        'ID identification'
    ];

    return existenceCheck(
        text,
        rasPatterns,
        'redundancy.ras_syndrome',
        'RAS syndrome detected: "{}". The acronym already contains the repeated word.',
        {
            ignoreCase: true,
            severity: 'warning',
            source: 'proselint'
        }
    );
}
