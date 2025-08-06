/**
 * Core interfaces and types for the Prose Lint plugin
 */

export interface ProseLintError {
    check: string;           // Check identifier (e.g., "weasel_words.very")
    message: string;         // Human-readable error message
    line: number;           // Line number (1-based)
    column: number;         // Column number (1-based)
    start: number;          // Character offset start
    end: number;            // Character offset end
    extent: number;         // Length of error
    severity: 'suggestion' | 'warning' | 'error';
    replacements?: string[]; // Suggested replacements
    source?: string;        // Attribution (e.g., "David Foster Wallace")
    sourceUrl?: string;     // Link to source material
}

export interface CheckResult {
    errors: ProseLintError[];
    checkId: string;
    executionTime?: number;
}

export interface CheckFunction {
    (text: string): Omit<ProseLintError, 'line' | 'column'>[];
}

export interface CheckMetadata {
    id: string;
    name: string;
    description: string;
    category: string;
    enabled: boolean;
    severity: 'suggestion' | 'warning' | 'error';
    source?: string;
    sourceUrl?: string;
}

export interface CheckCategory {
    id: string;
    name: string;
    description: string;
    checks: CheckMetadata[];
}

export interface LintConfig {
    maxErrors: number;
    checks: { [checkId: string]: boolean };
    severityOverrides?: { [checkId: string]: 'suggestion' | 'warning' | 'error' };
}

export interface LintResult {
    errors: ProseLintError[];
    totalChecks: number;
    enabledChecks: number;
    executionTime: number;
}
