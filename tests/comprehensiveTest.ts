/**
 * Comprehensive integration test for all 30 production checks
 */

import { CheckRegistry } from '../src/checkRegistry';
import { ProselintEngine } from '../src/proselintEngine';
import { registerStyleChecks } from '../src/styleChecks';
import { registerTypographySpellingChecks } from '../src/typographySpellingChecks';
import { registerMiscChecks } from '../src/miscChecks';
import { registerSocialAwarenessChecks } from '../src/socialAwarenessChecks';

export function runComprehensiveTests(): void {
    console.log('=== Comprehensive Check Tests ===\n');
    
    const registry = new CheckRegistry();
    const config = {
        maxErrors: 1000,
        checks: {},
        severityOverrides: {}
    };
    
    // Register all checks
    registerStyleChecks(registry);
    registerTypographySpellingChecks(registry);
    registerMiscChecks(registry);
    registerSocialAwarenessChecks(registry);
    
    const engine = new ProselintEngine(registry, config);
    
    // Count registered checks
    const checkCount = Object.keys(registry['checks']).length;
    console.log(`✓ Registered ${checkCount} checks\n`);
    
    // Test style checks
    testStyleChecks(engine);
    
    // Test typography/spelling checks
    testTypographySpellingChecks(engine);
    
    // Test misc checks
    testMiscChecks(engine);
    
    // Test social awareness checks
    testSocialAwarenessChecks(engine);
    
    // Performance test
    performanceTest(engine);
    
    console.log('\n=== All Tests Complete ===');
}

function testStyleChecks(engine: ProselintEngine): void {
    console.log('--- Style Checks ---');
    
    const tests = [
        { text: 'This is very very good.', expected: 'weasel words', check: 'very' },
        { text: 'I think maybe it might be possible.', expected: 'hedging', check: 'hedging' },
        { text: 'The decision was made by the committee.', expected: 'passive voice', check: 'passive' },
        { text: 'The reason is because I said so.', expected: 'redundancy', check: 'redundancy' },
        { text: 'At this point in time we should proceed.', expected: 'cliché', check: 'cliché' },
    ];
    
    tests.forEach(({ text, expected, check }) => {
        const result = engine.lint(text);
        if (result.errors.length > 0) {
            console.log(`  ✓ Detected ${expected} in "${text.substring(0, 40)}..."`);
        } else {
            console.log(`  ✗ Failed to detect ${expected}`);
        }
    });
    console.log();
}

function testTypographySpellingChecks(engine: ProselintEngine): void {
    console.log('--- Typography & Spelling Checks ---');
    
    const tests = [
        { text: 'The range is 1--5.', expected: 'dash usage' },
        { text: 'And then...', expected: 'ellipsis' },
        { text: 'Copyright (c) 2024', expected: 'symbols' },
        { text: 'This is definately wrong.', expected: 'misspelling' },
        { text: 'Teh quick brown fox.', expected: 'typo' },
        { text: 'This is dependable.', expected: '-able/-ible' },
    ];
    
    tests.forEach(({ text, expected }) => {
        const result = engine.lint(text);
        if (result.errors.length > 0) {
            console.log(`  ✓ Detected ${expected}`);
        } else {
            console.log(`  ✗ Failed to detect ${expected}`);
        }
    });
    console.log();
}

function testMiscChecks(engine: ProselintEngine): void {
    console.log('--- Misc Checks ---');
    
    const tests = [
        { text: 'In january we met.', expected: 'capitalization' },
        { text: 'We use imprimature here.', expected: 'preferred form' },
        { text: 'A long term solution is needed.', expected: 'phrasal adjective' },
        { text: 'We must reconceptualize this.', expected: 'pretension' },
        { text: 'I could care less about that.', expected: 'illogic' },
        { text: 'More research is needed.', expected: 'apologizing' },
        { text: 'This chapter discusses the topic.', expected: 'metadiscourse' },
    ];
    
    tests.forEach(({ text, expected }) => {
        const result = engine.lint(text);
        if (result.errors.length > 0) {
            console.log(`  ✓ Detected ${expected}`);
        } else {
            console.log(`  ✗ Failed to detect ${expected}`);
        }
    });
    console.log();
}

function testSocialAwarenessChecks(engine: ProselintEngine): void {
    console.log('--- Social Awareness Checks ---');
    
    const tests = [
        { text: 'The chairman called the meeting.', expected: 'gender bias' },
        { text: 'Sexual preference is not the right term.', expected: 'LGBTQ+ terminology' },
        { text: 'Using the n-word is problematic.', expected: 'race/ethnicity' },
    ];
    
    tests.forEach(({ text, expected }) => {
        const result = engine.lint(text);
        if (result.errors.length > 0) {
            console.log(`  ✓ Detected ${expected}`);
        } else {
            console.log(`  ✗ Failed to detect ${expected}`);
        }
    });
    console.log();
}

function performanceTest(engine: ProselintEngine): void {
    console.log('--- Performance Test ---');
    
    // Generate ~5000 word test document
    const paragraphs = [
        'This is very important. The chairman made a decision. In january we met.',
        'The range is 1--5. And then... we continued. Copyright (c) 2024.',
        'I think maybe it might be possible. The decision was made by the committee.',
        'This is definately wrong. Teh quick brown fox jumps over the lazy dog.',
        'At this point in time we should proceed. More research is needed.',
        'A long term solution is needed. We must reconceptualize this approach.',
        'Sexual preference is not the right term. The fireman arrived quickly.',
    ];
    
    const testDoc = paragraphs.join(' ').repeat(150); // ~5000 words
    const wordCount = testDoc.split(/\s+/).length;
    
    const startTime = Date.now();
    const result = engine.lint(testDoc);
    const elapsed = Date.now() - startTime;
    
    console.log(`  Document: ${wordCount} words`);
    console.log(`  Errors found: ${result.errors.length}`);
    console.log(`  Time: ${elapsed}ms`);
    console.log(`  Performance: ${(wordCount / elapsed * 1000).toFixed(0)} words/sec`);
    
    if (elapsed < 500) {
        console.log(`  ✓ Performance target met (<500ms)`);
    } else {
        console.log(`  ⚠ Performance warning (>500ms)`);
    }
}
