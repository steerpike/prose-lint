/**
 * Main Proselint Engine - coordinates linting process
 */

import { ProseLintError, LintConfig, LintResult, CheckResult } from './types';
import { CheckRegistry } from './checkRegistry';
import { lineAndColumn } from './utils';

export class ProselintEngine {
    private registry: CheckRegistry;
    private config: LintConfig;

    constructor(registry: CheckRegistry, config: LintConfig) {
        this.registry = registry;
        this.config = config;
    }

    /**
     * Main lint function - processes text and returns errors
     */
    lint(text: string): LintResult {
        const startTime = performance.now();
        const errors: ProseLintError[] = [];
        const enabledChecks = this.registry.getEnabledChecks(this.config.checks);

        for (const checkId of enabledChecks) {
            if (errors.length >= this.config.maxErrors) {
                break;
            }

            const checkFunction = this.registry.getCheck(checkId);
            const checkMetadata = this.registry.getCheckMetadata(checkId);

            if (!checkFunction || !checkMetadata) {
                continue;
            }

            try {
                const checkErrors = checkFunction(text);

                for (const error of checkErrors) {
                    const { line, column } = lineAndColumn(text, error.start);

                    const fullError: ProseLintError = {
                        ...error,
                        line,
                        column,
                        // Apply severity override if configured
                        severity: this.config.severityOverrides?.[checkId] || error.severity
                    };

                    errors.push(fullError);
                }
            } catch (err) {
                console.warn(`Error executing check ${checkId}:`, err);
            }
        }

        // Sort errors by line and column
        errors.sort((a, b) => {
            if (a.line !== b.line) {
                return a.line - b.line;
            }
            return a.column - b.column;
        });

        const executionTime = performance.now() - startTime;

        return {
            errors: errors.slice(0, this.config.maxErrors),
            totalChecks: this.registry.getCheckCount(),
            enabledChecks: enabledChecks.length,
            executionTime
        };
    }

    /**
     * Lint with detailed check results for debugging
     */
    lintWithDetails(text: string): {
        result: LintResult;
        checkResults: CheckResult[];
    } {
        const startTime = performance.now();
        const errors: ProseLintError[] = [];
        const checkResults: CheckResult[] = [];
        const enabledChecks = this.registry.getEnabledChecks(this.config.checks);

        for (const checkId of enabledChecks) {
            if (errors.length >= this.config.maxErrors) {
                break;
            }

            const checkFunction = this.registry.getCheck(checkId);
            const checkMetadata = this.registry.getCheckMetadata(checkId);

            if (!checkFunction || !checkMetadata) {
                continue;
            }

            const checkStartTime = performance.now();
            const checkErrors: ProseLintError[] = [];

            try {
                const rawErrors = checkFunction(text);

                for (const error of rawErrors) {
                    const { line, column } = lineAndColumn(text, error.start);

                    const fullError: ProseLintError = {
                        ...error,
                        line,
                        column,
                        severity: this.config.severityOverrides?.[checkId] || error.severity
                    };

                    checkErrors.push(fullError);
                    errors.push(fullError);
                }
            } catch (err) {
                console.warn(`Error executing check ${checkId}:`, err);
            }

            checkResults.push({
                checkId,
                errors: checkErrors,
                executionTime: performance.now() - checkStartTime
            });
        }

        // Sort errors by line and column
        errors.sort((a, b) => {
            if (a.line !== b.line) {
                return a.line - b.line;
            }
            return a.column - b.column;
        });

        const executionTime = performance.now() - startTime;

        return {
            result: {
                errors: errors.slice(0, this.config.maxErrors),
                totalChecks: this.registry.getCheckCount(),
                enabledChecks: enabledChecks.length,
                executionTime
            },
            checkResults
        };
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<LintConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Get current configuration
     */
    getConfig(): LintConfig {
        return { ...this.config };
    }

    /**
     * Get the registry (for access to check metadata)
     */
    getRegistry(): CheckRegistry {
        return this.registry;
    }
}
