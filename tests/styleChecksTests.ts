/**
 * Test suite for Style Checks
 * Tests weasel words, redundancy, hedging, clichés, and passive voice checks
 */

import { CheckRegistry } from '../src/checkRegistry';
import { ProselintEngine } from '../src/proselintEngine';
import { LintConfig } from '../src/types';
import { registerStyleChecks } from '../src/styleChecks';

/**
 * Run Phase 3 tests
 */
export async function runStyleChecksTests(): Promise<void> {
    console.log('Running Style Checks Tests...');

    try {
        // Test 1: Check Registry
        console.log('Testing style checks registration...');
        await testStyleChecksRegistry();
        console.log('✓ Style checks registry tests passed');

        // Test 2: Weasel Words Category
        console.log('Testing weasel words checks...');
        await testWeaselWordsChecks();
        console.log('✓ Weasel words tests passed');

        // Test 3: Redundancy Category
        console.log('Testing redundancy checks...');
        await testRedundancyChecks();
        console.log('✓ Redundancy tests passed');

        // Test 4: Hedging Category
        console.log('Testing hedging checks...');
        await testHedgingChecks();
        console.log('✓ Hedging tests passed');

        // Test 5: Clichés Category
        console.log('Testing clichés checks...');
        await testClichesChecks();
        console.log('✓ Clichés tests passed');

        // Test 6: Comprehensive Integration
        console.log('Testing comprehensive integration...');
        await testComprehensiveIntegration();
        console.log('✓ Comprehensive integration tests passed');

        console.log('✓ All style checks tests passed');

    } catch (error) {
        console.error('✗ Style checks tests failed:', error);
        throw error;
    }
}

async function testStyleChecksRegistry(): Promise<void> {
    const registry = new CheckRegistry();
    registerStyleChecks(registry);

    // Check that all expected checks are registered
    const expectedChecks = [
        'weasel_words.very',
        'weasel_words.misc',
        'weasel_words.there_is',
        'redundancy.misc',
        'redundancy.ras_syndrome',
        'hedging.misc',
        'hedging.filler_words',
        'cliches.misc',
        'cliches.hell'
    ];

    for (const checkId of expectedChecks) {
        if (!registry.hasCheck(checkId)) {
            throw new Error(`Expected check '${checkId}' not found in registry`);
        }
    }

    // Check categories
    const categories = registry.getAllCategories();
    const categoryNames = categories.map(c => c.id);
    const expectedCategories = ['weasel_words', 'redundancy', 'hedging', 'cliches'];

    for (const expectedCategory of expectedCategories) {
        if (!categoryNames.includes(expectedCategory)) {
            throw new Error(`Expected category '${expectedCategory}' not found`);
        }
    }

    console.log(`Registered ${registry.getCheckCount()} Phase 3 checks across ${categories.length} categories`);
}

async function testWeaselWordsChecks(): Promise<void> {
    const registry = new CheckRegistry();
    registerStyleChecks(registry);

    const config: LintConfig = {
        checks: {},
        maxErrors: 100
    };

    const engine = new ProselintEngine(registry, config);

    // Test "very" check
    const veryText = "This is very good and very important for very special people.";
    const veryResult = engine.lint(veryText);
    const veryErrors = veryResult.errors.filter(e => e.check === 'weasel_words.very');

    if (veryErrors.length !== 3) {
        throw new Error(`Expected 3 "very" errors, got ${veryErrors.length}`);
    }

    // Test weasel words check
    const weaselText = "In my opinion, it goes without saying that it is generally accepted.";
    const weaselResult = engine.lint(weaselText);
    const weaselErrors = weaselResult.errors.filter(e => e.check === 'weasel_words.misc');

    if (weaselErrors.length < 1) {
        throw new Error(`Expected at least 1 weasel word error, got ${weaselErrors.length}`);
    }

    // Test "there is" check
    const thereIsText = "There are many problems that there is no solution for.";
    const thereIsResult = engine.lint(thereIsText);
    const thereIsErrors = thereIsResult.errors.filter(e => e.check === 'weasel_words.there_is');

    console.log('There is/are test text:', thereIsText);
    console.log('There is/are errors found:', thereIsErrors.length);
    console.log('There is/are error details:', thereIsErrors.map(e => ({
        text: thereIsText.substring(e.start, e.end),
        start: e.start,
        end: e.end
    })));

    if (thereIsErrors.length !== 2) {
        throw new Error(`Expected 2 "there is/are" errors, got ${thereIsErrors.length}`);
    }
}

async function testRedundancyChecks(): Promise<void> {
    const registry = new CheckRegistry();
    registerStyleChecks(registry);

    const config: LintConfig = {
        checks: {},
        maxErrors: 100
    };

    const engine = new ProselintEngine(registry, config);

    // Test redundancy check
    const redundantText = "We need advance planning for the end result of our future plans.";
    const redundantResult = engine.lint(redundantText);
    const redundantErrors = redundantResult.errors.filter(e => e.check === 'redundancy.misc');

    if (redundantErrors.length !== 3) {
        throw new Error(`Expected 3 redundancy errors, got ${redundantErrors.length}`);
    }

    // Test RAS syndrome check
    const rasText = "I forgot my PIN number at the ATM machine.";
    const rasResult = engine.lint(rasText);
    const rasErrors = rasResult.errors.filter(e => e.check === 'redundancy.ras_syndrome');

    if (rasErrors.length !== 2) {
        throw new Error(`Expected 2 RAS syndrome errors, got ${rasErrors.length}`);
    }
}

async function testHedgingChecks(): Promise<void> {
    const registry = new CheckRegistry();
    registerStyleChecks(registry);

    const config: LintConfig = {
        checks: {},
        maxErrors: 100
    };

    const engine = new ProselintEngine(registry, config);

    // Test hedging check
    const hedgingText = "I think that maybe it's possible that this might work.";
    const hedgingResult = engine.lint(hedgingText);
    const hedgingErrors = hedgingResult.errors.filter(e => e.check === 'hedging.misc');

    if (hedgingErrors.length < 2) {
        throw new Error(`Expected at least 2 hedging errors, got ${hedgingErrors.length}`);
    }

    // Test filler words check
    const fillerText = "Actually, this is basically really important and obviously true.";
    const fillerResult = engine.lint(fillerText);
    const fillerErrors = fillerResult.errors.filter(e => e.check === 'hedging.filler_words');

    if (fillerErrors.length < 3) {
        throw new Error(`Expected at least 3 filler word errors, got ${fillerErrors.length}`);
    }
}

async function testClichesChecks(): Promise<void> {
    const registry = new CheckRegistry();
    registerStyleChecks(registry);

    const config: LintConfig = {
        checks: {},
        maxErrors: 100
    };

    const engine = new ProselintEngine(registry, config);

    // Test clichés check
    const clicheText = "Better late than never, but don't count your chickens before they hatch.";
    const clicheResult = engine.lint(clicheText);
    const clicheErrors = clicheResult.errors.filter(e => e.check === 'cliches.misc');

    if (clicheErrors.length !== 2) {
        throw new Error(`Expected 2 cliché errors, got ${clicheErrors.length}`);
    }

    // Test hell clichés check
    const hellText = "All hell broke loose when he went mad as hell.";
    const hellResult = engine.lint(hellText);
    const hellErrors = hellResult.errors.filter(e => e.check === 'cliches.hell');

    if (hellErrors.length !== 2) {
        throw new Error(`Expected 2 hell cliché errors, got ${hellErrors.length}`);
    }
}

async function testComprehensiveIntegration(): Promise<void> {
    const registry = new CheckRegistry();
    registerStyleChecks(registry);

    const config: LintConfig = {
        checks: {},
        maxErrors: 100
    };

    const engine = new ProselintEngine(registry, config);

    // Comprehensive test text with multiple error types
    const comprehensiveText = `
    This is very important and I think that we need advance planning for this project.
    There are many issues that obviously need to be addressed. It goes without saying
    that we should avoid the ATM machine problem. Better late than never, but all hell
    broke loose when we tried to gather together the consensus of opinion.
    `;

    const result = engine.lint(comprehensiveText);

    console.log(`Comprehensive test found ${result.errors.length} total errors:`);

    // Group errors by check type
    const errorsByCheck = new Map<string, number>();
    for (const error of result.errors) {
        errorsByCheck.set(error.check, (errorsByCheck.get(error.check) || 0) + 1);
    }

    for (const [check, count] of errorsByCheck.entries()) {
        console.log(`  ${check}: ${count} error(s)`);
    }

    // Verify we found errors from multiple categories
    const foundCategories = new Set<string>();
    for (const error of result.errors) {
        const category = error.check.split('.')[0];
        foundCategories.add(category);
    }

    const expectedCategories = ['weasel_words', 'redundancy', 'hedging', 'cliches'];
    for (const expectedCategory of expectedCategories) {
        if (!foundCategories.has(expectedCategory)) {
            throw new Error(`Expected to find errors from category '${expectedCategory}'`);
        }
    }

    if (result.errors.length < 8) {
        throw new Error(`Expected at least 8 total errors, got ${result.errors.length}`);
    }

    console.log(`✓ Found errors across ${foundCategories.size} categories`);
}
