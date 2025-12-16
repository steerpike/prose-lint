import { CheckRegistry } from './checkRegistry';
import { checkGenderBias } from './checks/genderBias';
import { checkLGBTQ } from './checks/lgbtq';
import { checkRaceEthnicity } from './checks/raceEthnicity';

/**
 * Register all social awareness checks (Week 3).
 * These checks help identify potentially biased or offensive language.
 */
export function registerSocialAwarenessChecks(registry: CheckRegistry): void {
    // Gender bias
    registry.registerCheck(
        'social_awareness.sexism',
        checkGenderBias,
        {
            name: 'Gender-Neutral Language',
            description: 'Flag gendered language that could be made more inclusive.',
            category: 'Social Awareness',
            enabled: true,
            severity: 'warning',
            source: 'Garner\'s Modern American Usage'
        }
    );
    
    // LGBTQ+ sensitivity
    registry.registerCheck(
        'social_awareness.lgbtq',
        checkLGBTQ,
        {
            name: 'LGBTQ+ Inclusive Language',
            description: 'Flag potentially offensive or outdated LGBTQ+ terminology.',
            category: 'Social Awareness',
            enabled: true,
            severity: 'warning',
            source: 'GLAAD Media Reference Guide'
        }
    );
    
    // Race/ethnicity sensitivity
    registry.registerCheck(
        'social_awareness.nword',
        checkRaceEthnicity,
        {
            name: 'Race/Ethnicity Sensitivity',
            description: 'Flag euphemistic references to offensive racial language.',
            category: 'Social Awareness',
            enabled: true,
            severity: 'warning',
            source: 'Proselint'
        }
    );
}
