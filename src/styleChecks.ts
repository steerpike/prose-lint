/**
 * Style Checks Registration
 * Weasel words, redundancy, hedging, clichés, and passive voice
 */

import { CheckRegistry } from './checkRegistry';

// Import style check implementations
import {
    checkVery as checkVeryProd,
    checkWeaselWords,
    checkThereIs
} from './checks/weaselWords';
import {
    checkRedundancy as checkRedundancyProd,
    checkRasSyndrome
} from './checks/redundancy';
import {
    checkHedging as checkHedgingProd,
    checkFillerWords
} from './checks/hedging';
import {
    checkCliches,
    checkHellCliches
} from './checks/cliches';
import {
    checkPassiveVoice,
    checkPassiveVoiceAdvanced
} from './checks/passiveVoice';

/**
 * Register all style checks (weasel words, redundancy, hedging, clichés, passive voice)
 */
export function registerStyleChecks(registry: CheckRegistry): void {
    // Weasel Words Category
    registry.registerCheck('weasel_words.very', checkVeryProd, {
        name: 'Remove "Very"',
        description: '"Very" is a weak intensifier. Consider removing it or using a stronger word.',
        category: 'weasel_words',
        severity: 'warning',
        enabled: true,
        source: 'proselint'
    });

    registry.registerCheck('weasel_words.misc', checkWeaselWords, {
        name: 'Weasel Words',
        description: 'Detect vague, imprecise language that weakens writing.',
        category: 'weasel_words',
        severity: 'warning',
        enabled: true,
        source: 'proselint'
    });

    registry.registerCheck('weasel_words.there_is', checkThereIs, {
        name: 'There Is/Are Constructions',
        description: 'Detect "there is/are" constructions that often indicate weak writing.',
        category: 'weasel_words',
        severity: 'suggestion',
        enabled: true,
        source: 'proselint'
    });

    // Redundancy Category
    registry.registerCheck('redundancy.misc', checkRedundancyProd, {
        name: 'Redundant Phrases',
        description: 'Identify redundant phrases that can be simplified.',
        category: 'redundancy',
        severity: 'warning',
        enabled: true,
        source: 'proselint'
    });

    registry.registerCheck('redundancy.ras_syndrome', checkRasSyndrome, {
        name: 'RAS Syndrome',
        description: 'Detect Redundant Acronym Syndrome (e.g., "ATM machine").',
        category: 'redundancy',
        severity: 'warning',
        enabled: true,
        source: 'proselint'
    });

    // Hedging Category
    registry.registerCheck('hedging.misc', checkHedgingProd, {
        name: 'Hedging Language',
        description: 'Detect uncertain, tentative language that undermines confidence.',
        category: 'hedging',
        severity: 'suggestion',
        enabled: true,
        source: 'proselint'
    });

    registry.registerCheck('hedging.filler_words', checkFillerWords, {
        name: 'Filler Words',
        description: 'Detect filler words that weaken writing.',
        category: 'hedging',
        severity: 'suggestion',
        enabled: true,
        source: 'proselint'
    });

    // Clichés Category
    registry.registerCheck('cliches.misc', checkCliches, {
        name: 'Common Clichés',
        description: 'Flag overused expressions and suggest original alternatives.',
        category: 'cliches',
        severity: 'suggestion',
        enabled: true,
        source: 'proselint'
    });

    registry.registerCheck('cliches.hell', checkHellCliches, {
        name: 'Hell Clichés',
        description: 'Detect clichés containing "hell".',
        category: 'cliches',
        severity: 'suggestion',
        enabled: true,
        source: 'proselint'
    });

    // Passive Voice Category
    registry.registerCheck('passive_voice.construction', checkPassiveVoice, {
        name: 'Passive Voice',
        description: 'Detect passive voice constructions and suggest active alternatives.',
        category: 'passive_voice',
        severity: 'suggestion',
        enabled: true,
        source: 'proselint'
    });

    registry.registerCheck('passive_voice.advanced', checkPassiveVoiceAdvanced, {
        name: 'Advanced Passive Voice',
        description: 'Advanced passive voice detection with better context analysis.',
        category: 'passive_voice',
        severity: 'suggestion',
        enabled: false, // Disabled by default to avoid duplicate detection
        source: 'proselint'
    });
}
