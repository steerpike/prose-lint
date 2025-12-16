/**
 * Test suite for Core Linting Engine
 * Tests CheckRegistry, ProselintEngine, and basic check functionality
 */

import { CheckRegistry } from '../src/checkRegistry';
import { ProselintEngine } from '../src/proselintEngine';
import { LintConfig } from '../src/types';
import { checkVery, checkHedging, checkRedundancy } from '../src/checks/testChecks';

// Test configuration
const testConfig: LintConfig = {
    maxErrors: 10,
    checks: {
        'weasel_words.very': true,
        'hedging.misc': true,
        'redundancy.misc': true
    },
    severityOverrides: {}
};

export function runEngineTests(): boolean {
    console.log('Running Engine Tests...');

    let allTestsPassed = true;

    // Test 1: CheckRegistry functionality
    try {
        const registry = new CheckRegistry();

        // Register test checks
        registry.registerCheck('weasel_words.very', checkVery, {
            name: 'Avoid "very"',
            description: 'Test check for very',
            category: 'weasel_words',
            enabled: true,
            severity: 'warning'
        });

        registry.registerCheck('hedging.misc', checkHedging, {
            name: 'Avoid hedging',
            description: 'Test check for hedging',
            category: 'hedging',
            enabled: true,
            severity: 'suggestion'
        });

        // Test registry functions
        if (registry.getCheckCount() !== 2) {
            throw new Error(`Expected 2 checks, got ${registry.getCheckCount()}`);
        }

        if (!registry.hasCheck('weasel_words.very')) {
            throw new Error('Registry should have weasel_words.very check');
        }

        const categories = registry.getAllCategories();
        if (categories.length !== 2) {
            throw new Error(`Expected 2 categories, got ${categories.length}`);
        }

        console.log('✓ CheckRegistry tests passed');
    } catch (error) {
        console.error('✗ CheckRegistry tests failed:', error);
        allTestsPassed = false;
    }

    // Test 2: ProselintEngine functionality
    try {
        const registry = new CheckRegistry();

        // Register test checks
        registry.registerCheck('weasel_words.very', checkVery, {
            name: 'Avoid "very"',
            description: 'Test check for very',
            category: 'weasel_words',
            enabled: true,
            severity: 'warning'
        });

        registry.registerCheck('hedging.misc', checkHedging, {
            name: 'Avoid hedging',
            description: 'Test check for hedging',
            category: 'hedging',
            enabled: true,
            severity: 'suggestion'
        });

        registry.registerCheck('redundancy.misc', checkRedundancy, {
            name: 'Avoid redundancy',
            description: 'Test check for redundancy',
            category: 'redundancy',
            enabled: true,
            severity: 'warning'
        });

        const engine = new ProselintEngine(registry, testConfig);

        // Test basic linting
        const testText = "This is very good and I would argue that it's quite excellent. We need advance planning for this.";
        const result = engine.lint(testText);

        console.log('Test text:', testText);
        console.log('Found errors:', result.errors.map(e => ({ check: e.check, message: e.message, text: testText.substring(e.start, e.end) })));

        if (result.errors.length === 0) {
            throw new Error('Expected to find errors in test text');
        }

        // Check that we found expected errors
        const errorTypes = result.errors.map(e => e.check);
        const hasVeryError = errorTypes.includes('weasel_words.very');
        const hasHedgingError = errorTypes.includes('hedging.misc');
        const hasRedundancyError = errorTypes.includes('redundancy.misc');

        console.log('Error types found:', errorTypes);
        console.log('Has very error:', hasVeryError);
        console.log('Has hedging error:', hasHedgingError);
        console.log('Has redundancy error:', hasRedundancyError);

        if (!hasVeryError) {
            throw new Error('Expected to find "very" error');
        }

        if (!hasHedgingError) {
            throw new Error('Expected to find hedging error');
        }

        if (!hasRedundancyError) {
            throw new Error('Expected to find redundancy error');
        }

        // Test that errors have required properties
        for (const error of result.errors) {
            if (!error.check || !error.message || !error.line || !error.column ||
                error.start === undefined || error.end === undefined) {
                throw new Error('Error missing required properties');
            }
        }

        console.log('✓ ProselintEngine tests passed');
    } catch (error) {
        console.error('✗ ProselintEngine tests failed:', error);
        allTestsPassed = false;
    }

    // Test 3: Configuration updates
    try {
        const registry = new CheckRegistry();
        registry.registerCheck('weasel_words.very', checkVery, {
            name: 'Avoid "very"',
            description: 'Test check for very',
            category: 'weasel_words',
            enabled: true,
            severity: 'warning'
        });

        const engine = new ProselintEngine(registry, testConfig);

        // Test with check disabled
        engine.updateConfig({
            checks: { 'weasel_words.very': false }
        });

        const testText = "This is very good.";
        const result = engine.lint(testText);

        if (result.errors.length > 0) {
            throw new Error('Expected no errors when check is disabled');
        }

        console.log('✓ Configuration update tests passed');
    } catch (error) {
        console.error('✗ Configuration update tests failed:', error);
        allTestsPassed = false;
    }

    // Test 4: Line and column calculation
    try {
        const registry = new CheckRegistry();
        registry.registerCheck('weasel_words.very', checkVery, {
            name: 'Avoid "very"',
            description: 'Test check for very',
            category: 'weasel_words',
            enabled: true,
            severity: 'warning'
        });

        const engine = new ProselintEngine(registry, testConfig);

        const testText = "Line 1\nLine 2 has very bad text\nLine 3";
        const result = engine.lint(testText);

        if (result.errors.length === 0) {
            throw new Error('Expected to find error');
        }

        const error = result.errors[0];
        if (error.line !== 2) {
            throw new Error(`Expected error on line 2, got line ${error.line}`);
        }

        if (error.column < 10) {
            throw new Error(`Expected column > 10, got ${error.column}`);
        }

        console.log('✓ Line and column calculation tests passed');
    } catch (error) {
        console.error('✗ Line and column calculation tests failed:', error);
        allTestsPassed = false;
    }

    console.log(allTestsPassed ? '✓ All Phase 2 tests passed!' : '✗ Some Phase 2 tests failed');
    return allTestsPassed;
}
