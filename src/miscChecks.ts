import { CheckRegistry } from './checkRegistry';
import { checkCapitalization } from './checks/capitalization';
import { checkPreferredForms } from './checks/preferredForms';
import { checkPhrasalAdjectives } from './checks/phrasalAdjectives';
import { checkPretension } from './checks/pretension';
import { checkIllogic } from './checks/illogic';
import { checkScareQuotes } from './checks/scareQuotes';
import { checkApologizing } from './checks/apologizing';
import { checkMetadiscourse } from './checks/metadiscourse';

/**
 * Register all miscellaneous checks (Week 2).
 * These checks cover various writing issues from capitalization to metadiscourse.
 */
export function registerMiscChecks(registry: CheckRegistry): void {
    // Capitalization
    registry.registerCheck(
        'misc.capitalization',
        checkCapitalization,
        {
            name: 'Capitalization',
            description: 'Check for incorrect capitalization of proper nouns, seasons, and months.',
            category: 'Misc',
            enabled: true,
            severity: 'suggestion',
            source: 'Garner\'s Modern American Usage'
        }
    );
    
    // Preferred forms
    registry.registerCheck(
        'misc.preferred_forms',
        checkPreferredForms,
        {
            name: 'Preferred Forms',
            description: 'Check for non-standard forms of words and phrases.',
            category: 'Misc',
            enabled: true,
            severity: 'suggestion',
            source: 'Garner\'s Modern American Usage'
        }
    );
    
    // Phrasal adjectives
    registry.registerCheck(
        'misc.phrasal_adjectives',
        checkPhrasalAdjectives,
        {
            name: 'Phrasal Adjectives',
            description: 'Check for missing hyphens in compound modifiers.',
            category: 'Misc',
            enabled: true,
            severity: 'suggestion',
            source: 'Garner\'s Modern American Usage'
        }
    );
    
    // Pretension
    registry.registerCheck(
        'misc.pretension',
        checkPretension,
        {
            name: 'Pretentious Jargon',
            description: 'Flag overly formal or pretentious language.',
            category: 'Misc',
            enabled: true,
            severity: 'suggestion',
            source: 'David Ogilvy'
        }
    );
    
    // Illogic
    registry.registerCheck(
        'misc.illogic',
        checkIllogic,
        {
            name: 'Illogical Constructions',
            description: 'Flag logically inconsistent phrases and constructions.',
            category: 'Misc',
            enabled: true,
            severity: 'warning',
            source: 'Garner\'s Modern American Usage'
        }
    );
    
    // Scare quotes
    registry.registerCheck(
        'misc.scare_quotes',
        checkScareQuotes,
        {
            name: 'Scare Quotes',
            description: 'Check for inappropriate use of scare quotes.',
            category: 'Misc',
            enabled: true,
            severity: 'suggestion',
            source: 'Pinker\'s "The Sense of Style"'
        }
    );
    
    // Apologizing
    registry.registerCheck(
        'misc.apologizing',
        checkApologizing,
        {
            name: 'Excessive Apologizing',
            description: 'Flag unnecessary apologetic phrases in writing.',
            category: 'Misc',
            enabled: true,
            severity: 'suggestion',
            source: 'Pinker\'s "The Sense of Style"'
        }
    );
    
    // Metadiscourse
    registry.registerCheck(
        'misc.metadiscourse',
        checkMetadiscourse,
        {
            name: 'Metadiscourse',
            description: 'Flag excessive self-referential writing.',
            category: 'Misc',
            enabled: true,
            severity: 'suggestion',
            source: 'Pinker\'s "The Sense of Style"'
        }
    );
}
