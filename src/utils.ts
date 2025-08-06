/**
 * Utility functions for text processing and error detection
 * Ported from proselint/tools.py
 */

import { ProseLintError } from './types';

/**
 * Calculate line and column number from character position in text
 */
export function lineAndColumn(text: string, position: number): { line: number; column: number } {
    let line = 0;
    let column = 0;

    for (let i = 0; i < position && i < text.length; i++) {
        if (text[i] === '\n') {
            line++;
            column = 0;
        } else {
            column++;
        }
    }

    return { line: line + 1, column: column + 1 }; // 1-based indexing
}

/**
 * Check if a position is within quoted text (basic implementation)
 */
export function isQuoted(position: number, text: string): boolean {
    // Enhanced quote detection that handles contractions
    const beforeText = text.substring(0, position);

    // Count only actual quotes, not contractions
    // An apostrophe is likely a contraction if it's between letters
    let singleQuoteCount = 0;
    let doubleQuoteCount = 0;

    for (let i = 0; i < beforeText.length; i++) {
        const char = beforeText[i];

        if (char === '"') {
            doubleQuoteCount++;
        } else if (char === "'") {
            // Check if this is likely a contraction (apostrophe between letters)
            const prevChar = i > 0 ? beforeText[i - 1] : '';
            const nextChar = i < beforeText.length - 1 ? beforeText[i + 1] : '';

            // If the apostrophe is between letters, it's likely a contraction
            const isContraction = /[a-zA-Z]/.test(prevChar) && /[a-zA-Z]/.test(nextChar);

            if (!isContraction) {
                singleQuoteCount++;
            }
        }
    }

    const isInQuotes = (singleQuoteCount % 2 === 1) || (doubleQuoteCount % 2 === 1);

    return isInQuotes;
}

/**
 * Basic existence check - finds patterns in text
 */
export function existenceCheck(
    text: string,
    patterns: string[],
    checkId: string,
    message: string,
    options: {
        ignoreCase?: boolean;
        requirePadding?: boolean;
        severity?: 'suggestion' | 'warning' | 'error';
        replacements?: string[];
        source?: string;
        sourceUrl?: string;
    } = {}
): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    const flags = options.ignoreCase ? 'gi' : 'g';

    for (const pattern of patterns) {
        let regex: RegExp;

        if (options.requirePadding !== false) {
            // Escape special regex characters in the pattern
            const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // For multi-word phrases, use word boundary at start and end
            // but allow for spaces within the phrase
            regex = new RegExp(`\\b${escapedPattern}\\b`, flags);
        } else {
            regex = new RegExp(pattern, flags);
        }

        let match;
        while ((match = regex.exec(text)) !== null) {
            const matchText = match[0];
            const start = match.index;
            const end = start + matchText.length;

            // Skip if in quoted text
            if (isQuoted(start, text)) {
                continue;
            }

            errors.push({
                check: checkId,
                message: message.replace('{}', matchText),
                start,
                end,
                extent: end - start,
                severity: options.severity || 'warning',
                replacements: options.replacements,
                source: options.source,
                sourceUrl: options.sourceUrl
            });
        }
    }

    return errors;
}

/**
 * Preferred forms check - suggests better alternatives
 */
export function preferredFormsCheck(
    text: string,
    wordPairs: Array<[string, string[]]>, // [preferred, [variants...]]
    checkId: string,
    message: string,
    options: {
        ignoreCase?: boolean;
        severity?: 'suggestion' | 'warning' | 'error';
        source?: string;
        sourceUrl?: string;
    } = {}
): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    const flags = options.ignoreCase ? 'gi' : 'g';

    for (const [preferred, variants] of wordPairs) {
        for (const variant of variants) {
            const regex = new RegExp(`(?:^|\\W)(${variant})(?:\\W|$)`, flags);

            let match;
            while ((match = regex.exec(text)) !== null) {
                const matchText = match[1];
                const start = match.index + match[0].indexOf(match[1]);
                const end = start + matchText.length;

                if (isQuoted(start, text)) {
                    continue;
                }

                errors.push({
                    check: checkId,
                    message: message.replace('{}', preferred).replace('{}', matchText),
                    start,
                    end,
                    extent: end - start,
                    severity: options.severity || 'suggestion',
                    replacements: [preferred],
                    source: options.source,
                    sourceUrl: options.sourceUrl
                });
            }
        }
    }

    return errors;
}

/**
 * Consistency check - ensures consistent usage of word pairs
 */
export function consistencyCheck(
    text: string,
    wordPairs: Array<[string, string]>, // [variant1, variant2]
    checkId: string,
    message: string,
    options: {
        ignoreCase?: boolean;
        severity?: 'suggestion' | 'warning' | 'error';
        source?: string;
        sourceUrl?: string;
    } = {}
): Omit<ProseLintError, 'line' | 'column'>[] {
    const errors: Omit<ProseLintError, 'line' | 'column'>[] = [];
    const flags = options.ignoreCase ? 'gi' : 'g';

    for (const [word1, word2] of wordPairs) {
        const regex1 = new RegExp(`(?:^|\\W)(${word1})(?:\\W|$)`, flags);
        const regex2 = new RegExp(`(?:^|\\W)(${word2})(?:\\W|$)`, flags);

        const matches1 = Array.from(text.matchAll(regex1));
        const matches2 = Array.from(text.matchAll(regex2));

        if (matches1.length > 0 && matches2.length > 0) {
            // Use the less frequent variant as the error
            const minorityMatches = matches1.length > matches2.length ? matches2 : matches1;
            const majorityWord = matches1.length > matches2.length ? word1 : word2;

            for (const match of minorityMatches) {
                const matchText = match[1];
                const start = match.index! + match[0].indexOf(match[1]);
                const end = start + matchText.length;

                if (isQuoted(start, text)) {
                    continue;
                }

                errors.push({
                    check: checkId,
                    message: message.replace('{}', majorityWord).replace('{}', matchText),
                    start,
                    end,
                    extent: end - start,
                    severity: options.severity || 'suggestion',
                    replacements: [majorityWord],
                    source: options.source,
                    sourceUrl: options.sourceUrl
                });
            }
        }
    }

    return errors;
}
