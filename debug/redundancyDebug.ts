/**
 * Debug redundancy check issue
 */

import { checkRedundancy } from '../src/checks/testChecks';

export function debugRedundancyCheck(): void {
    console.log('=== Debugging Redundancy Check ===');

    const testTexts = [
        "We need advance planning for this.",
        "This requires advance planning.",
        "advance planning",
        "The advance planning was good.",
        "I think advance planning is essential."
    ];

    for (const text of testTexts) {
        console.log(`Testing: "${text}"`);
        const result = checkRedundancy(text);
        console.log(`Found ${result.length} errors:`, result.map(e => ({
            check: e.check,
            message: e.message,
            start: e.start,
            end: e.end,
            matchedText: text.substring(e.start, e.end)
        })));
        console.log('---');
    }
}
