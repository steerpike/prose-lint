/**
 * Modal for displaying lint results
 */

import { App, Modal, Setting } from 'obsidian';
import { LintResult, ProseLintError } from './types';

export class LintResultModal extends Modal {
    private result: LintResult;

    constructor(app: App, result: LintResult) {
        super(app);
        this.result = result;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        // Title
        contentEl.createEl('h2', { text: 'Prose Lint Results' });

        // Summary
        const summary = contentEl.createDiv('prose-lint-summary');
        summary.createEl('p', {
            text: `Found ${this.result.errors.length} issue${this.result.errors.length !== 1 ? 's' : ''} ` +
                  `(${this.result.enabledChecks} checks enabled, ${this.result.executionTime.toFixed(1)}ms)`
        });

        if (this.result.errors.length === 0) {
            contentEl.createEl('p', { text: 'No issues found! Your prose looks great.' });
            return;
        }

        // Group errors by type
        const errorsByType = new Map<string, ProseLintError[]>();
        for (const error of this.result.errors) {
            if (!errorsByType.has(error.check)) {
                errorsByType.set(error.check, []);
            }
            errorsByType.get(error.check)!.push(error);
        }

        // Display errors by type
        for (const [checkId, errors] of errorsByType) {
            const section = contentEl.createDiv('prose-lint-error-section');

            const header = section.createEl('h3', { text: `${checkId} (${errors.length})` });
            header.addClass('prose-lint-check-header');

            for (const error of errors) {
                const errorDiv = section.createDiv('prose-lint-error');
                errorDiv.addClass(`prose-lint-${error.severity}`);

                const locationText = `Line ${error.line}, Column ${error.column}`;
                const location = errorDiv.createEl('span', { text: locationText });
                location.addClass('prose-lint-location');

                const message = errorDiv.createEl('p', { text: error.message });
                message.addClass('prose-lint-message');

                if (error.source) {
                    const source = errorDiv.createEl('small', { text: `— ${error.source}` });
                    source.addClass('prose-lint-source');
                }

                if (error.replacements && error.replacements.length > 0) {
                    const suggestions = errorDiv.createEl('div');
                    suggestions.addClass('prose-lint-suggestions');
                    suggestions.createEl('strong', { text: 'Suggestions: ' });
                    suggestions.createSpan({ text: error.replacements.join(', ') });
                }
            }
        }

        // Close button
        const buttonDiv = contentEl.createDiv('prose-lint-buttons');
        const closeButton = buttonDiv.createEl('button', { text: 'Close' });
        closeButton.onclick = () => this.close();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
