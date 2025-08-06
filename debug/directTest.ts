/**
 * Simple test to debug the redundancy check issue
 */

import { checkRedundancy } from '../src/checks/testChecks';
import { existenceCheck } from '../src/utils';

// Test the exact text from the failing test
const testText = "This is very good and I would argue that it's quite excellent. We need advance planning for this.";

console.log('=== Direct Redundancy Check Test ===');
console.log('Test text:', testText);

// Test the redundancy check directly
const redundancyResult = checkRedundancy(testText);
console.log('Redundancy check result:', redundancyResult);

// Test existenceCheck directly with just "advance planning"
const directResult = existenceCheck(
    testText,
    ['advance planning'],
    'test.redundancy',
    'Test message: "{}"',
    { ignoreCase: true }
);
console.log('Direct existenceCheck result:', directResult);

// Test with different regex patterns
console.log('\n=== Regex Pattern Tests ===');
const patterns = [
    /(?:^|\W)(advance planning)(?:\W|$)/gi,
    /(?:^|\s|\W)(advance planning)(?:\s|\W|$)/gi,
    /(advance planning)/gi,
    /\badvance planning\b/gi
];

patterns.forEach((regex, index) => {
    console.log(`Pattern ${index + 1}: ${regex}`);
    const matches = Array.from(testText.matchAll(regex));
    console.log('Matches:', matches.map(m => ({
        match: m[0],
        captured: m[1],
        index: m.index
    })));
});

export { }; // Make this a module
