/**
 * Error Display Panel
 * Shows all prose lint errors in a dedicated view
 */

import { ItemView, WorkspaceLeaf, MarkdownView } from 'obsidian';
import { ProseLintError } from './types';

export const PROSE_LINT_VIEW_TYPE = 'prose-lint-errors';

export class ErrorDisplayPanel extends ItemView {
    private errors: ProseLintError[] = [];
    private currentFile: string = '';

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return PROSE_LINT_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Prose Lint Errors';
    }

    getIcon(): string {
        return 'spell-check';
    }

    async onOpen(): Promise<void> {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl('div', { cls: 'prose-lint-panel', text: 'No errors to display' });
    }

    async onClose(): Promise<void> {
        // Cleanup if needed
    }

    /**
     * Update the panel with new errors
     */
    updateErrors(errors: ProseLintError[], fileName: string): void {
        this.errors = errors;
        this.currentFile = fileName;
        this.refresh();
    }

    /**
     * Refresh the display
     */
    private refresh(): void {
        const container = this.containerEl.children[1];
        container.empty();

        // Create main panel
        const panel = container.createEl('div', { cls: 'prose-lint-panel' });

        // Header
        const header = panel.createEl('div', { cls: 'prose-lint-panel-header' });
        header.createEl('span', { text: `Prose Lint: ${this.currentFile || 'Current Document'}` });

        if (this.errors.length > 0) {
            const errorCount = header.createEl('span', { cls: 'prose-lint-error-count' });
            errorCount.setText(`${this.errors.length} error${this.errors.length !== 1 ? 's' : ''}`);
        }

        // No errors message
        if (this.errors.length === 0) {
            panel.createEl('div', {
                text: '✓ No prose lint issues found!',
                cls: 'prose-lint-no-errors'
            });
            return;
        }

        // Group errors by category
        const errorsByCategory = this.groupErrorsByCategory();

        // Display errors by category
        for (const [category, categoryErrors] of errorsByCategory) {
            this.renderCategory(panel, category, categoryErrors);
        }

        // Summary stats
        this.renderSummary(panel);
    }

    /**
     * Group errors by category
     */
    private groupErrorsByCategory(): Map<string, ProseLintError[]> {
        const grouped = new Map<string, ProseLintError[]>();

        for (const error of this.errors) {
            const category = this.getCategoryFromCheck(error.check);
            if (!grouped.has(category)) {
                grouped.set(category, []);
            }
            grouped.get(category)!.push(error);
        }

        return grouped;
    }

    /**
     * Extract category from check ID
     */
    private getCategoryFromCheck(checkId: string): string {
        const parts = checkId.split('.');
        return parts[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Render a category section
     */
    private renderCategory(container: HTMLElement, category: string, errors: ProseLintError[]): void {
        const categoryDiv = container.createEl('div', { cls: 'prose-lint-category' });

        // Category header
        const categoryHeader = categoryDiv.createEl('div', { cls: 'prose-lint-category-header' });
        categoryHeader.createEl('span', { text: category });
        categoryHeader.createEl('span', {
            cls: 'prose-lint-category-count',
            text: errors.length.toString()
        });

        // Error items
        for (const error of errors) {
            this.renderErrorItem(categoryDiv, error);
        }
    }

    /**
     * Render an individual error item
     */
    private renderErrorItem(container: HTMLElement, error: ProseLintError): void {
        const errorDiv = container.createEl('div', {
            cls: `prose-lint-error-item ${error.severity}`
        });

        // Error message
        errorDiv.createEl('div', {
            cls: 'prose-lint-error-message',
            text: error.message
        });

        // Error location
        const locationText = `Line ${error.line}, Column ${error.column}`;
        errorDiv.createEl('div', {
            cls: 'prose-lint-error-location',
            text: locationText
        });

        // Error text snippet
        if (error.start !== undefined && error.end !== undefined) {
            const textSnippet = this.getErrorTextSnippet(error);
            if (textSnippet) {
                errorDiv.createEl('div', {
                    cls: 'prose-lint-error-text',
                    text: `"${textSnippet}"`
                });
            }
        }

        // Action buttons
        const actionsDiv = errorDiv.createEl('div', { cls: 'prose-lint-error-actions' });

        // Navigate to error button
        const navButton = actionsDiv.createEl('button', {
            cls: 'prose-lint-button',
            text: 'Go to'
        });
        navButton.onclick = () => this.navigateToError(error);

        // Ignore button (placeholder for future implementation)
        const ignoreButton = actionsDiv.createEl('button', {
            cls: 'prose-lint-button',
            text: 'Ignore'
        });
        ignoreButton.onclick = () => this.ignoreError(error);
    }

    /**
     * Get a text snippet for the error
     */
    private getErrorTextSnippet(error: ProseLintError): string {
        // This would need access to the document text
        // For now, we'll extract from the check if possible
        const match = error.message.match(/"([^"]+)"/);
        return match ? match[1] : '';
    }

    /**
     * Navigate to the error location in the editor
     */
    private navigateToError(error: ProseLintError): void {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView && activeView.editor) {
            const editor = activeView.editor;

            // Convert error position to editor coordinates
            const pos = { line: error.line - 1, ch: error.column - 1 };

            // Move cursor and scroll to position
            editor.setCursor(pos);
            editor.scrollIntoView({ from: pos, to: pos }, true);

            // Focus the editor
            activeView.editor.focus();
        }
    }

    /**
     * Ignore an error (placeholder for future implementation)
     */
    private ignoreError(error: ProseLintError): void {
        // TODO: Implement ignore functionality
        console.log('Ignoring error:', error);
    }

    /**
     * Render summary statistics
     */
    private renderSummary(container: HTMLElement): void {
        const summaryDiv = container.createEl('div', { cls: 'prose-lint-summary' });

        // Count by severity
        const severityCounts = this.errors.reduce((counts, error) => {
            counts[error.severity] = (counts[error.severity] || 0) + 1;
            return counts;
        }, {} as Record<string, number>);

        const summaryText = Object.entries(severityCounts)
            .map(([severity, count]) => `${count} ${severity}${count !== 1 ? 's' : ''}`)
            .join(', ');

        summaryDiv.createEl('div', {
            text: `Total: ${summaryText}`,
            cls: 'prose-lint-summary-text'
        });

        // Action buttons
        const actionsDiv = summaryDiv.createEl('div', { cls: 'prose-lint-summary-actions' });

        const refreshButton = actionsDiv.createEl('button', {
            cls: 'prose-lint-button primary',
            text: 'Refresh'
        });
        refreshButton.onclick = () => this.requestRefresh();
    }

    /**
     * Request a refresh from the main plugin
     */
    private requestRefresh(): void {
        // This would trigger a re-lint of the current document
        // For now, just log
        console.log('Refresh requested');
    }
}
