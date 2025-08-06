// Quick test of the regex fix
const text = "This is very good and I would argue that it's quite excellent. We need advance planning for this.";
const pattern = "advance planning";

// Escape special regex characters in the pattern
const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Create regex with word boundaries
const regex = new RegExp(`\\b${escapedPattern}\\b`, 'gi');

console.log('Text:', text);
console.log('Pattern:', pattern);
console.log('Escaped pattern:', escapedPattern);
console.log('Regex:', regex);

let match;
while ((match = regex.exec(text)) !== null) {
    console.log('Found match:', match[0], 'at position', match.index);
}

console.log('Test complete');
