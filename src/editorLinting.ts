/**
 * Real-time Editor Integration
 * Provides live linting with CodeMirror integration
 */

import { Editor, EditorPosition, MarkdownView } from 'obsidian';
import { ProselintEngine } from './proselintEngine';
import { ProseLintError } from './types';

export interface EditorLintingOptions {
    debounceMs: number;
    maxErrors: number;
    enableRealTime: boolean;
    highlightErrors: boolean;
    showTooltips: boolean;
}

export class EditorLinting {
    private engine: ProselintEngine;
    private options: EditorLintingOptions;
    private debounceTimer: NodeJS.Timeout | null = null;
    private currentErrors: ProseLintError[] = [];
    private activeEditor: Editor | null = null;
    private errorDecorations: any[] = [];
    private tooltipElement: HTMLElement | null = null;
    private tooltipMap: Map<string, ProseLintError> = new Map(); // Maps position keys to errors

    // Store bound event handlers for proper cleanup
    private boundMouseOver: ((event: MouseEvent) => void) | null = null;
    private boundMouseOut: ((event: MouseEvent) => void) | null = null;
    private boundMouseMove: ((event: MouseEvent) => void) | null = null;
    private currentEditorContainer: HTMLElement | null = null;

    constructor(engine: ProselintEngine, options: EditorLintingOptions) {
        this.engine = engine;
        this.options = options;
    }

    /**
     * Enable real-time linting for an editor
     */
    enableLinting(editor: Editor): void {
        console.log('EditorLinting.enableLinting called, enableRealTime:', this.options.enableRealTime);

        if (!this.options.enableRealTime) {
            console.log('Real-time linting is disabled, skipping');
            return;
        }

        this.activeEditor = editor;
        console.log('Real-time linting enabled for editor');

        // For now, we'll use a different approach since Obsidian Editor
        // doesn't expose change events directly. We'll rely on manual triggering
        // and periodic checks in the main plugin

        // Run initial lint
        this.performLint(editor);
    }

    /**
     * Disable real-time linting for an editor
     */
    disableLinting(editor: Editor): void {
        this.clearErrorHighlights(editor);
        this.currentErrors = [];

        if (this.activeEditor === editor) {
            this.activeEditor = null;
        }
    }

    /**
     * Manually trigger linting (to be called from plugin when editor changes)
     */
    triggerLint(editor: Editor): void {
        console.log('EditorLinting.triggerLint called, enableRealTime:', this.options.enableRealTime);

        if (this.options.enableRealTime) {
            this.debouncedLint(editor);
        }
    }

    /**
     * Get current errors for the active editor
     */
    getCurrentErrors(): ProseLintError[] {
        return [...this.currentErrors];
    }

    /**
     * Check if real-time linting is enabled
     */
    isRealTimeLintingEnabled(): boolean {
        return this.options.enableRealTime;
    }

    /**
     * Toggle real-time linting on/off
     */
    toggleRealTimeLinting(): void {
        this.options.enableRealTime = !this.options.enableRealTime;
    }

    /**
     * Public method to update error highlights (called from main plugin)
     */
    updateErrorHighlights(editor: Editor, errors: ProseLintError[]): void {
        this.currentErrors = errors.slice(0, this.options.maxErrors);

        if (this.options.highlightErrors) {
            this.updateErrorHighlightsInternal(editor, this.currentErrors);
        }
    }

    /**
     * Debounced lint function
     */
    private debouncedLint(editor: Editor): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.performLint(editor);
        }, this.options.debounceMs);
    }

    /**
     * Perform the actual linting
     */
    private performLint(editor: Editor): void {
        console.log('EditorLinting.performLint called');
        const text = editor.getValue();
        console.log('Text length:', text.length, 'First 50 chars:', text.substring(0, 50));

        // Skip linting if text is empty or too short
        if (!text || text.length < 10) {
            console.log('Text too short, skipping lint');
            this.clearErrorHighlights(editor);
            this.currentErrors = [];
            return;
        }

        try {
            console.log('Running prose lint engine...');
            const result = this.engine.lint(text);
            console.log('Lint result:', result.errors.length, 'errors found');
            this.currentErrors = result.errors.slice(0, this.options.maxErrors);

            if (this.options.highlightErrors) {
                console.log('Updating error highlights...');
                this.updateErrorHighlightsInternal(editor, this.currentErrors);
            } else {
                console.log('Error highlighting disabled');
            }

            // Emit event for UI updates
            this.onErrorsUpdated(this.currentErrors);

        } catch (error) {
            console.error('Prose lint error:', error);
            this.clearErrorHighlights(editor);
            this.currentErrors = [];
        }
    }

    /**
     * Update error highlights in the editor (internal method)
     */
    private updateErrorHighlightsInternal(editor: Editor, errors: ProseLintError[]): void {
        console.log('updateErrorHighlightsInternal called with', errors.length, 'errors');

        // Clear existing highlights
        this.clearErrorHighlights(editor);

        // Add new highlights
        for (const error of errors) {
            try {
                console.log('Processing error:', error.message, 'at', error.start, '-', error.end);
                const startPos = this.offsetToPosition(editor, error.start);
                const endPos = this.offsetToPosition(editor, error.end);
                console.log('Converted positions:', startPos, 'to', endPos);

                if (startPos && endPos) {
                    this.addErrorHighlight(editor, startPos, endPos, error);
                } else {
                    console.warn('Invalid positions for error:', error);
                }
            } catch (e) {
                console.warn('Failed to highlight error:', e);
            }
        }
    }

    /**
     * Add a single error highlight using proper CodeMirror markText API
     */
    private addErrorHighlight(
        editor: Editor,
        start: EditorPosition,
        end: EditorPosition,
        error: ProseLintError
    ): void {
        console.log('addErrorHighlight called with:', { start, end, error: error.message });

        try {
            // Access the CodeMirror instance - try multiple approaches
            const cm = (editor as any).cm;

            console.log('CodeMirror instance found:', !!cm);
            console.log('CM properties:', cm ? Object.keys(cm) : 'none');

            // Try different ways to access markText
            let markTextMethod = null;
            if (cm) {
                if (typeof cm.markText === 'function') {
                    markTextMethod = cm.markText.bind(cm);
                    console.log('Found cm.markText method');
                } else if (cm.state && cm.state.doc && typeof cm.state.doc.markText === 'function') {
                    markTextMethod = cm.state.doc.markText.bind(cm.state.doc);
                    console.log('Found cm.state.doc.markText method');
                } else if (cm.view && typeof cm.view.markText === 'function') {
                    markTextMethod = cm.view.markText.bind(cm.view);
                    console.log('Found cm.view.markText method');
                } else {
                    console.log('Available CM methods:', cm ? Object.getOwnPropertyNames(cm).filter(name => typeof cm[name] === 'function') : 'none');
                }
            }

            if (markTextMethod) {
                console.log('Using CodeMirror markText method');

                // Get the actual text being highlighted for verification
                const text = editor.getRange(start, end);
                console.log('Editor text at position:', `"${text}"`);

                // Use CodeMirror's markText method with proper CSS classes
                const cssClass = this.getSeverityCssClass(error.severity);
                console.log('Using CSS class:', cssClass);

                const marker = markTextMethod(
                    { line: start.line, ch: start.ch },
                    { line: end.line, ch: end.ch },
                    {
                        className: cssClass,
                        title: error.message,
                        clearOnEnter: false,
                        inclusiveLeft: false,
                        inclusiveRight: false
                    }
                );

                // Store decoration info for cleanup
                const decoration = {
                    start: start,
                    end: end,
                    error: error,
                    text: text,
                    marker: marker,
                    clear: () => {
                        if (marker && marker.clear) {
                            marker.clear();
                        }
                    }
                };

                this.errorDecorations.push(decoration);
                console.log('addErrorHighlight: Text marked successfully, decoration count:', this.errorDecorations.length);

            } else {
                console.log('CodeMirror markText method not available, using fallback');
                this.addFallbackHighlight(editor, start, end, error);
            }

        } catch (e) {
            console.warn('Failed to add error highlight:', e);
            this.addFallbackHighlight(editor, start, end, error);
        }
    }

    /**
     * Get CSS class based on error severity
     */
    private getSeverityCssClass(severity: string): string {
        console.log('Getting CSS class for severity:', severity);
        switch (severity?.toLowerCase()) {
            case 'error':
                console.log('Using error class: prose-lint-error');
                return 'prose-lint-error';
            case 'warning':
                console.log('Using warning class: prose-lint-warning');
                return 'prose-lint-warning';
            case 'suggestion':
                console.log('Using suggestion class: prose-lint-suggestion');
                return 'prose-lint-suggestion';
            default:
                console.log('Using default error class for unknown severity:', severity);
                return 'prose-lint-error';
        }
    }

    /**
     * Fallback highlighting method for when markText is not available
     */
    private addFallbackHighlight(
        editor: Editor,
        start: EditorPosition,
        end: EditorPosition,
        error: ProseLintError
    ): void {
        console.log('Adding fallback highlight for:', error.message);

        try {
            // Let's try to investigate the Obsidian Editor API
            console.log('Editor properties:', Object.getOwnPropertyNames(editor));
            console.log('Editor methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(editor)));

            // Check if editor has any decoration-related methods
            const editorAny = editor as any;
            console.log('Editor.cm:', !!editorAny.cm);
            console.log('Editor.editorEl:', !!editorAny.editorEl);
            console.log('Editor.containerEl:', !!editorAny.containerEl);

            // Try to access CodeMirror 6 state/view
            if (editorAny.cm) {
                const cm = editorAny.cm;
                console.log('CM type:', typeof cm);
                console.log('CM constructor:', cm.constructor?.name);
                console.log('CM dispatch:', !!cm.dispatch);
                console.log('CM state:', !!cm.state);
                console.log('CM view:', !!cm.view);

                // Try CodeMirror 6 approach with decorations
                if (cm.dispatch && cm.state) {
                    console.log('Attempting CodeMirror 6 decoration approach...');
                    this.addCM6Decoration(cm, editor, start, end, error);
                    return;
                }
            }

            // Original fallback approach
            const editorView = (editor as any).cm;
            if (editorView && editorView.dom) {
                // Add visual indicator to editor container
                const editorContainer = editorView.dom;
                editorContainer.style.borderLeft = '4px solid orange';
                editorContainer.style.backgroundColor = 'rgba(255, 165, 0, 0.05)';

                // Add error count indicator
                let statusEl = editorContainer.querySelector('.prose-lint-status');
                if (!statusEl) {
                    statusEl = document.createElement('div');
                    statusEl.className = 'prose-lint-status';
                    statusEl.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: orange;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        z-index: 1000;
                        pointer-events: none;
                    `;
                    editorContainer.style.position = 'relative';
                    editorContainer.appendChild(statusEl);
                }

                const errorCount = this.errorDecorations.length + 1;
                statusEl.textContent = `${errorCount} prose lint error${errorCount === 1 ? '' : 's'}`;

                console.log('Added fallback visual indicator');
            }
        } catch (e) {
            console.warn('Failed to add fallback highlight:', e);
        }
    }

    /**
     * Attempt CodeMirror 6 decoration approach using Obsidian's Editor API
     */
    private addCM6Decoration(cm: any, editor: Editor, start: EditorPosition, end: EditorPosition, error: ProseLintError): void {
        try {
            console.log('Trying CM6 decoration using Obsidian Editor API...');

            // Convert positions to offsets
            const fromOffset = editor.posToOffset(start);
            const toOffset = editor.posToOffset(end);
            console.log('CM6 offsets:', fromOffset, 'to', toOffset);

            // Get the text
            const text = editor.getRange(start, end);
            console.log('CM6 text:', `"${text}"`);

            // Try using Obsidian's addHighlights method
            const editorAny = editor as any;
            if (editorAny.addHighlights && editorAny.removeHighlights) {
                console.log('Using Obsidian Editor addHighlights method');

                const cssClass = this.getSeverityCssClass(error.severity);
                console.log('Using CSS class for highlighting:', cssClass);

                // Check if this position is already highlighted to avoid duplicates
                const positionKey = `${start.line}-${start.ch}-${end.line}-${end.ch}`;
                const existingHighlight = this.errorDecorations.find(dec =>
                    dec.start.line === start.line &&
                    dec.start.ch === start.ch &&
                    dec.end.line === end.line &&
                    dec.end.ch === end.ch
                );

                if (existingHighlight) {
                    console.log('Position already highlighted, skipping duplicate');
                    return;
                }

                // Store error information for tooltips
                this.tooltipMap.set(positionKey, error);

                // Try different highlight definition formats
                console.log('Trying different highlight formats...');

                try {
                    // Format 1: Try with position objects and explicit CSS class
                    const highlight1 = {
                        from: start,
                        to: end,
                        class: cssClass
                    };
                    console.log('Trying format 1 (positions):', highlight1);
                    editorAny.addHighlights([highlight1], cssClass);

                    // Store decoration info for cleanup
                    const decoration = {
                        start: start,
                        end: end,
                        error: error,
                        text: text,
                        fromOffset: fromOffset,
                        toOffset: toOffset,
                        highlightClass: cssClass,
                        positionKey: positionKey,
                        clear: () => {
                            console.log('Obsidian highlight cleanup called for class:', cssClass);
                            if (editorAny.removeHighlights) {
                                editorAny.removeHighlights(cssClass);
                            }
                        }
                    };

                    this.errorDecorations.push(decoration);
                    console.log('Obsidian highlight added successfully with positions, decoration count:', this.errorDecorations.length);

                    // Also inject our custom CSS to ensure proper styling
                    this.ensureHighlightStyling(cssClass);

                    // Initialize tooltip functionality if enabled
                    if (this.options.showTooltips) {
                        this.initializeTooltips(editor);
                    }

                    return;

                } catch (posError) {
                    console.log('Position format failed:', posError);

                    try {
                        // Format 2: Try simpler format with just from/to offsets
                        const highlight2 = {
                            from: fromOffset,
                            to: toOffset
                        };
                        console.log('Trying format 2 (simple offsets):', highlight2);
                        editorAny.addHighlights([highlight2], cssClass);

                        const decoration = {
                            start: start,
                            end: end,
                            error: error,
                            text: text,
                            fromOffset: fromOffset,
                            toOffset: toOffset,
                            highlightClass: cssClass,
                            clear: () => {
                                console.log('Obsidian highlight cleanup called');
                                if (editorAny.removeHighlights) {
                                    editorAny.removeHighlights(cssClass);
                                }
                            }
                        };

                        this.errorDecorations.push(decoration);
                        console.log('Obsidian highlight added successfully with simple format, decoration count:', this.errorDecorations.length);
                        return;

                    } catch (simpleError) {
                        console.log('Simple format failed:', simpleError);

                        try {
                            // Format 3: Try with line/ch structure
                            const highlight3 = [{
                                from: { line: start.line, ch: start.ch },
                                to: { line: end.line, ch: end.ch },
                                class: cssClass
                            }];
                            console.log('Trying format 3 (line/ch structure):', highlight3);
                            editorAny.addHighlights(highlight3, cssClass);

                            const decoration = {
                                start: start,
                                end: end,
                                error: error,
                                text: text,
                                fromOffset: fromOffset,
                                toOffset: toOffset,
                                highlightClass: cssClass,
                                clear: () => {
                                    console.log('Obsidian highlight cleanup called');
                                    if (editorAny.removeHighlights) {
                                        editorAny.removeHighlights(cssClass);
                                    }
                                }
                            };

                            this.errorDecorations.push(decoration);
                            console.log('Obsidian highlight added successfully with line/ch format, decoration count:', this.errorDecorations.length);
                            return;

                        } catch (lineChError) {
                            console.log('Line/ch format failed:', lineChError);
                            console.log('All Obsidian addHighlights formats failed, falling back to CM6 dispatch');
                        }
                    }
                }
            }

            // Fallback: Try direct CodeMirror 6 dispatch approach
            if (cm.dispatch && cm.state) {
                console.log('Trying direct CM6 dispatch approach...');

                try {
                    const cssClass = this.getSeverityCssClass(error.severity);

                    // Try using CodeMirror 6's StateEffect approach for decorations
                    // This requires creating a simple transaction to add marks
                    console.log('Attempting to create CM6 transaction...');

                    // Since we don't have direct access to CM6 decorations API,
                    // let's try a completely different approach: CSS-based highlighting
                    this.addCSSBasedHighlight(editor, start, end, error, cssClass);
                    return;

                } catch (dispatchError) {
                    console.log('CM6 dispatch failed:', dispatchError);
                }
            }

            // Ultimate fallback: CSS-based highlighting
            console.log('Using CSS-based highlighting as final fallback');
            const cssClass = this.getSeverityCssClass(error.severity);
            this.addCSSBasedHighlight(editor, start, end, error, cssClass);

        } catch (e) {
            console.warn('CM6 decoration failed:', e);
        }
    }

    /**
     * Add CSS-based highlighting by directly manipulating the editor DOM
     */
    private addCSSBasedHighlight(editor: Editor, start: EditorPosition, end: EditorPosition, error: ProseLintError, cssClass: string): void {
        try {
            console.log('Adding CSS-based highlight...');

            const editorAny = editor as any;
            const cm = editorAny.cm;

            if (!cm || !cm.dom) {
                console.log('No CM DOM found for CSS highlighting');
                return;
            }

            // Get the text to highlight
            const text = editor.getRange(start, end);
            console.log('Highlighting text:', `"${text}"`);

            // Create a unique identifier for this highlight
            const highlightId = `prose-lint-${Date.now()}-${Math.random()}`;

            // Add CSS highlighting using a more robust approach
            // We'll add a style element that targets specific text positions
            this.addPositionalCSS(cm.dom, start, end, text, cssClass, highlightId, error.message);

            // Store decoration info for cleanup
            const decoration = {
                start: start,
                end: end,
                error: error,
                text: text,
                highlightId: highlightId,
                cssClass: cssClass,
                clear: () => {
                    console.log('CSS highlight cleanup called');
                    this.removeCSSHighlight(highlightId);
                }
            };

            this.errorDecorations.push(decoration);
            console.log('CSS-based highlight added, decoration count:', this.errorDecorations.length);

        } catch (e) {
            console.warn('CSS-based highlighting failed:', e);
        }
    }

    /**
     * Add positional CSS for highlighting specific text
     */
    private addPositionalCSS(editorDOM: Element, start: EditorPosition, end: EditorPosition, text: string, cssClass: string, highlightId: string, errorMessage: string): void {
        try {
            // Find the content area where text is rendered
            const contentArea = editorDOM.querySelector('.cm-content, .cm-editor, .CodeMirror-code');
            if (!contentArea) {
                console.log('No content area found for CSS highlighting');
                return;
            }

            console.log('Found content area for CSS highlighting');

            // Create a style element for this specific highlight
            const styleEl = document.createElement('style');
            styleEl.id = highlightId;

            // Add CSS that will highlight the text
            // We'll use a more general approach since we can't easily target specific positions
            styleEl.textContent = `
                .cm-content .cm-line {
                    position: relative;
                }

                /* Highlight style for our errors */
                .${cssClass}-highlight {
                    background-color: ${this.getHighlightColor(cssClass)};
                    border-bottom: 2px wavy ${this.getHighlightBorderColor(cssClass)};
                    border-radius: 2px;
                    padding: 1px 2px;
                    position: relative;
                    display: inline;
                }

                .${cssClass}-highlight::after {
                    content: '${errorMessage}';
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    z-index: 1000;
                    max-width: 300px;
                    word-wrap: break-word;
                }

                .${cssClass}-highlight:hover::after {
                    opacity: 1;
                }
            `;

            document.head.appendChild(styleEl);

            // Now try to find and wrap the actual text
            this.wrapTextWithHighlight(contentArea, text, cssClass, highlightId);

        } catch (e) {
            console.warn('Failed to add positional CSS:', e);
        }
    }

    /**
     * Wrap specific text with highlight class
     */
    private wrapTextWithHighlight(contentArea: Element, text: string, cssClass: string, highlightId: string): void {
        try {
            console.log('Attempting to wrap text with highlight:', text);

            // Find text nodes containing our target text
            const walker = document.createTreeWalker(
                contentArea,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node: Node) {
                        return node.textContent && node.textContent.includes(text) ?
                            NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                }
            );

            let textNode;
            while (textNode = walker.nextNode()) {
                const nodeText = textNode.textContent || '';
                const index = nodeText.indexOf(text);

                if (index !== -1) {
                    console.log('Found text node containing target text');

                    // Split the text node and wrap the target part
                    const parentNode = textNode.parentNode;
                    if (parentNode) {
                        const beforeText = nodeText.substring(0, index);
                        const targetText = nodeText.substring(index, index + text.length);
                        const afterText = nodeText.substring(index + text.length);

                        // Create new nodes
                        const beforeNode = document.createTextNode(beforeText);
                        const wrapperSpan = document.createElement('span');
                        wrapperSpan.className = `${cssClass}-highlight`;
                        wrapperSpan.setAttribute('data-highlight-id', highlightId);
                        wrapperSpan.textContent = targetText;
                        const afterNode = document.createTextNode(afterText);

                        // Replace the original text node
                        parentNode.insertBefore(beforeNode, textNode);
                        parentNode.insertBefore(wrapperSpan, textNode);
                        parentNode.insertBefore(afterNode, textNode);
                        parentNode.removeChild(textNode);

                        console.log('Text wrapped with highlight successfully');
                        break; // Only highlight the first occurrence
                    }
                }
            }

        } catch (e) {
            console.warn('Failed to wrap text with highlight:', e);
        }
    }

    /**
     * Get highlight background color based on CSS class
     */
    private getHighlightColor(cssClass: string): string {
        switch (cssClass) {
            case 'prose-lint-error':
                return 'rgba(255, 0, 0, 0.2)';
            case 'prose-lint-warning':
                return 'rgba(255, 165, 0, 0.2)';
            case 'prose-lint-suggestion':
                return 'rgba(0, 100, 255, 0.2)';
            default:
                return 'rgba(255, 0, 0, 0.2)';
        }
    }

    /**
     * Get highlight border color based on CSS class
     */
    private getHighlightBorderColor(cssClass: string): string {
        switch (cssClass) {
            case 'prose-lint-error':
                return '#ff0000';
            case 'prose-lint-warning':
                return '#ffa500';
            case 'prose-lint-suggestion':
                return '#0064ff';
            default:
                return '#ff0000';
        }
    }

    /**
     * Ensure proper CSS styling is applied for highlights
     */
    private ensureHighlightStyling(cssClass: string): void {
        try {
            // Check if our CSS is already applied
            const existingStyle = document.getElementById('prose-lint-highlight-styles');
            if (existingStyle) {
                return; // Already applied
            }

            // Add our highlight styles to the document
            const styleEl = document.createElement('style');
            styleEl.id = 'prose-lint-highlight-styles';
            styleEl.textContent = `
                /* Prose Lint Highlight Styles */
                .prose-lint-error {
                    background-color: rgba(255, 0, 0, 0.15) !important;
                    border-bottom: 2px wavy #dc3545 !important;
                    position: relative;
                    cursor: help;
                }

                .prose-lint-warning {
                    background-color: rgba(255, 193, 7, 0.15) !important;
                    border-bottom: 2px wavy #ffc107 !important;
                    position: relative;
                    cursor: help;
                }

                .prose-lint-suggestion {
                    background-color: rgba(13, 202, 240, 0.15) !important;
                    border-bottom: 2px wavy #0dcaf0 !important;
                    position: relative;
                    cursor: help;
                }

                /* Hover effects */
                .prose-lint-error:hover,
                .prose-lint-warning:hover,
                .prose-lint-suggestion:hover {
                    opacity: 0.8;
                }

                /* Tooltip styles */
                .prose-lint-tooltip {
                    position: absolute;
                    z-index: 10000;
                    background: var(--background-primary);
                    border: 1px solid var(--background-modifier-border);
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 13px;
                    line-height: 1.4;
                    color: var(--text-normal);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    max-width: 300px;
                    word-wrap: break-word;
                    pointer-events: none;
                    opacity: 0;
                    transform: translateY(-5px);
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }

                .prose-lint-tooltip.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                .prose-lint-tooltip::before {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 5px solid transparent;
                    border-top-color: var(--background-modifier-border);
                }

                .prose-lint-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-1px);
                    border: 4px solid transparent;
                    border-top-color: var(--background-primary);
                }

                .prose-lint-tooltip-header {
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: var(--text-accent);
                }

                .prose-lint-tooltip-rule {
                    font-size: 11px;
                    opacity: 0.7;
                    margin-top: 4px;
                    font-family: var(--font-monospace);
                }

                .prose-lint-tooltip-severity {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    font-weight: 500;
                    text-transform: uppercase;
                    margin-left: 6px;
                }

                .prose-lint-tooltip-severity.error {
                    background-color: rgba(255, 0, 0, 0.1);
                    color: #dc3545;
                }

                .prose-lint-tooltip-severity.warning {
                    background-color: rgba(255, 193, 7, 0.1);
                    color: #ffc107;
                }

                .prose-lint-tooltip-severity.suggestion {
                    background-color: rgba(13, 202, 240, 0.1);
                    color: #0dcaf0;
                }
            `;

            document.head.appendChild(styleEl);
            console.log('Added prose lint highlight styles with tooltip support to document head');

        } catch (e) {
            console.warn('Failed to ensure highlight styling:', e);
        }
    }

    /**
     * Initialize tooltip functionality for the editor
     */
    private initializeTooltips(editor: Editor): void {
        if (!this.options.showTooltips) {
            return;
        }

        console.log('Initializing tooltip functionality');

        // Create tooltip element if it doesn't exist
        if (!this.tooltipElement) {
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.className = 'prose-lint-tooltip';
            document.body.appendChild(this.tooltipElement);
        }

        // Get the editor container element
        const editorAny = editor as any;
        const editorContainer = editorAny.cm?.dom || editorAny.containerEl;

        if (!editorContainer) {
            console.warn('Could not find editor container for tooltip initialization');
            return;
        }

        // Remove existing listeners if we had a previous container
        this.removeTooltipListeners();

        // Store the current container and create bound event handlers
        this.currentEditorContainer = editorContainer;
        this.boundMouseOver = this.handleMouseOver.bind(this);
        this.boundMouseOut = this.handleMouseOut.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);

        // Add mouse event listeners
        editorContainer.addEventListener('mouseover', this.boundMouseOver);
        editorContainer.addEventListener('mouseout', this.boundMouseOut);
        editorContainer.addEventListener('mousemove', this.boundMouseMove);

        console.log('Tooltip event listeners added to editor container');
    }

    /**
     * Handle mouse over events for tooltip display
     */
    private handleMouseOver(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // Check if the target has a prose lint highlight class
        if (target && this.isHighlightedElement(target)) {
            const error = this.getErrorForElement(target);
            if (error) {
                this.showTooltip(error, event.clientX, event.clientY);
            }
        }
    }

    /**
     * Handle mouse out events for tooltip hiding
     */
    private handleMouseOut(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if (target && this.isHighlightedElement(target)) {
            // Small delay to allow moving to tooltip
            setTimeout(() => {
                if (this.tooltipElement && !this.tooltipElement.matches(':hover')) {
                    this.hideTooltip();
                }
            }, 100);
        }
    }

    /**
     * Handle mouse move events for tooltip positioning
     */
    private handleMouseMove(event: MouseEvent): void {
        if (this.tooltipElement && this.tooltipElement.classList.contains('show')) {
            this.positionTooltip(event.clientX, event.clientY);
        }
    }

    /**
     * Check if an element is a highlighted prose lint element
     */
    private isHighlightedElement(element: HTMLElement): boolean {
        return element.classList.contains('prose-lint-error') ||
               element.classList.contains('prose-lint-warning') ||
               element.classList.contains('prose-lint-suggestion');
    }

    /**
     * Get the character offset of an element in the editor
     */
    private getElementOffset(element: HTMLElement): number | null {
        try {
            if (!this.activeEditor) return null;

            // Get the editor view
            const editorView = (this.activeEditor as any).cm;
            if (!editorView) return null;

            // Walk up the DOM to find the editor element
            let current: Node | null = element;
            let offset = 0;

            while (current && current.parentNode) {
                // If we find a text node, we need to calculate its position
                if (current.nodeType === Node.TEXT_NODE) {
                    const textContent = current.textContent || '';
                    const parent = current.parentNode;
                    
                    // Find the position of this text node within its parent
                    let precedingLength = 0;
                    for (let i = 0; i < parent.childNodes.length; i++) {
                        const sibling = parent.childNodes[i];
                        if (sibling === current) break;
                        if (sibling.nodeType === Node.TEXT_NODE) {
                            precedingLength += sibling.textContent?.length || 0;
                        }
                    }
                    
                    offset += precedingLength;
                    break;
                }

                // Move up the DOM tree
                current = current.parentNode;
            }

            // Try to find the position using CodeMirror's DOM utilities
            const pos = editorView.posAtDOM(element);
            if (pos >= 0) {
                return pos;
            }

            return null;
        } catch (e) {
            console.warn('Error getting element offset:', e);
            return null;
        }
    }

    /**
     * Get the error information for a highlighted element
     */
    private getErrorForElement(element: HTMLElement): ProseLintError | null {
        try {
            const text = element.textContent;
            if (!text) return null;

            // Get the element's position in the editor
            const elementOffset = this.getElementOffset(element);
            if (elementOffset === null) return null;

            // Find the error that matches this element's position and text
            return this.currentErrors.find(error => {
                if (!this.activeEditor) return false;
                
                // Check if the element's position falls within the error's range
                const errorStart = error.start;
                const errorEnd = error.end;
                
                // The element should start at or after the error start
                // and end at or before the error end
                if (elementOffset >= errorStart && elementOffset < errorEnd) {
                    // Double-check by comparing the text content
                    const startPos = this.offsetToPosition(this.activeEditor, errorStart);
                    const endPos = this.offsetToPosition(this.activeEditor, errorEnd);
                    if (!startPos || !endPos) return false;

                    const errorText = this.activeEditor.getRange(startPos, endPos);
                    return errorText === text;
                }
                
                return false;
            }) || null;

        } catch (e) {
            console.warn('Error getting error for element:', e);
            return null;
        }
    }

    /**
     * Show tooltip with error information
     */
    private showTooltip(error: ProseLintError, x: number, y: number): void {
        if (!this.tooltipElement || !this.options.showTooltips) {
            return;
        }

        // Create tooltip content
        const content = this.createTooltipContent(error);
        this.tooltipElement.innerHTML = content;

        // Position and show tooltip
        this.positionTooltip(x, y);
        this.tooltipElement.classList.add('show');

        console.log('Tooltip shown for error:', error.check);
    }

    /**
     * Hide tooltip
     */
    private hideTooltip(): void {
        if (this.tooltipElement) {
            this.tooltipElement.classList.remove('show');
        }
    }

    /**
     * Position tooltip near the cursor
     */
    private positionTooltip(x: number, y: number): void {
        if (!this.tooltipElement) return;

        const tooltip = this.tooltipElement;
        const padding = 10;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        // Get tooltip dimensions
        tooltip.style.visibility = 'hidden';
        tooltip.style.display = 'block';
        const rect = tooltip.getBoundingClientRect();
        tooltip.style.visibility = '';
        tooltip.style.display = '';

        // Calculate position
        let left = x + scrollX + padding;
        let top = y + scrollY - rect.height - padding;

        // Adjust if tooltip would go off screen
        if (left + rect.width > window.innerWidth + scrollX) {
            left = x + scrollX - rect.width - padding;
        }
        if (top < scrollY) {
            top = y + scrollY + padding;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    /**
     * Create tooltip content HTML
     */
    private createTooltipContent(error: ProseLintError): string {
        const severityClass = error.severity || 'suggestion';
        const ruleName = error.check || 'prose_lint';
        const source = error.source ? ` (${error.source})` : '';

        let content = `
            <div class="prose-lint-tooltip-header">
                ${error.message}
                <span class="prose-lint-tooltip-severity ${severityClass}">${severityClass}</span>
            </div>
        `;

        if (error.replacements && error.replacements.length > 0) {
            content += `
                <div style="margin-top: 6px; font-size: 12px;">
                    <strong>Suggestions:</strong><br>
                    ${error.replacements.map(r => `• ${r}`).join('<br>')}
                </div>
            `;
        }

        content += `<div class="prose-lint-tooltip-rule">${ruleName}${source}</div>`;

        return content;
    }

    /**
     * Remove tooltip event listeners from current container
     */
    private removeTooltipListeners(): void {
        if (this.currentEditorContainer && this.boundMouseOver && this.boundMouseOut && this.boundMouseMove) {
            console.log('Removing tooltip event listeners from previous container');
            this.currentEditorContainer.removeEventListener('mouseover', this.boundMouseOver);
            this.currentEditorContainer.removeEventListener('mouseout', this.boundMouseOut);
            this.currentEditorContainer.removeEventListener('mousemove', this.boundMouseMove);

            this.currentEditorContainer = null;
            this.boundMouseOver = null;
            this.boundMouseOut = null;
            this.boundMouseMove = null;
        }
    }

    /**
     * Clean up tooltip resources
     */
    private cleanupTooltips(): void {
        // Remove event listeners first
        this.removeTooltipListeners();

        // Clean up tooltip element
        if (this.tooltipElement) {
            this.tooltipElement.remove();
            this.tooltipElement = null;
        }

        // Clear tooltip map
        this.tooltipMap.clear();
    }

    /**
     * Remove CSS-based highlight
     */
    private removeCSSHighlight(highlightId: string): void {
        try {
            // Remove the style element
            const styleEl = document.getElementById(highlightId);
            if (styleEl) {
                styleEl.remove();
                console.log('Removed CSS style for highlight:', highlightId);
            }

            // Remove any wrapper spans
            const wrapperSpans = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);
            wrapperSpans.forEach(span => {
                const parent = span.parentNode;
                if (parent) {
                    // Replace the span with its text content
                    const textNode = document.createTextNode(span.textContent || '');
                    parent.insertBefore(textNode, span);
                    parent.removeChild(span);
                }
            });

            console.log('Removed wrapper spans for highlight:', highlightId);

        } catch (e) {
            console.warn('Failed to remove CSS highlight:', e);
        }
    }

    private addDOMHighlight(editorView: any, start: EditorPosition, end: EditorPosition, text: string, error: ProseLintError): void {
        try {
            console.log('Attempting text-level highlighting for text:', `"${text}"`, 'at positions:', start, 'to', end);

            // Remove the editor-wide border since we want text-level highlighting
            const editorContainer = editorView.dom;
            if (editorContainer) {
                editorContainer.style.borderLeft = '';
                editorContainer.classList.remove('prose-lint-has-errors');
            }

            // Try to find and highlight the specific text using a more direct approach
            const contentDOM = editorView.contentDOM;
            if (!contentDOM) {
                console.log('No contentDOM found for text highlighting');
                return;
            }

            console.log('ContentDOM found, searching for text:', `"${text}"`);

            // Use a simpler approach: find all text nodes and look for our target text
            this.highlightTextByContent(contentDOM, text, error);

        } catch (e) {
            console.warn('Text-level highlighting failed:', e);
        }
    }

    private highlightTextByContent(contentDOM: Element, targetText: string, error: ProseLintError): void {
        try {
            // Use a more direct approach: find text nodes containing our target text
            // But avoid already highlighted nodes
            const walker = document.createTreeWalker(
                contentDOM,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node: Node) {
                        // Skip text nodes that are inside highlight spans
                        let parent = node.parentNode;
                        while (parent && parent !== contentDOM) {
                            if (parent instanceof Element && parent.classList.contains('prose-lint-error')) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            parent = parent.parentNode;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let textNode: Text | null = null;
            let highlightCount = 0;

            console.log('Searching for text:', `"${targetText}"`, '(avoiding already highlighted nodes)');

            while (textNode = walker.nextNode() as Text) {
                const nodeText = textNode.textContent || '';
                const targetIndex = nodeText.indexOf(targetText);

                if (targetIndex !== -1) {
                    console.log('Found target text in clean node:', `"${nodeText}"`, 'at index:', targetIndex);

                    // Split the text node and wrap the target portion
                    const beforeText = nodeText.substring(0, targetIndex);
                    const afterText = nodeText.substring(targetIndex + targetText.length);

                    const parent = textNode.parentNode;
                    if (parent) {
                        // Create highlight span
                        const span = document.createElement('span');
                        span.className = `prose-lint-error prose-lint-${error.severity}`;
                        span.title = error.message;
                        span.style.backgroundColor = 'rgba(255, 165, 0, 0.3)'; // Orange highlight
                        span.style.borderBottom = '2px wavy orange';
                        span.style.padding = '1px 2px';
                        span.style.borderRadius = '2px';
                        span.textContent = targetText;

                        console.log('Created clean span element:', span.outerHTML);

                        // Replace the text node with our components
                        if (beforeText) {
                            parent.insertBefore(document.createTextNode(beforeText), textNode);
                        }
                        parent.insertBefore(span, textNode);
                        if (afterText) {
                            parent.insertBefore(document.createTextNode(afterText), textNode);
                        }
                        parent.removeChild(textNode);

                        highlightCount++;
                        console.log('Successfully highlighted:', `"${targetText}"`, 'highlight count:', highlightCount);

                        // Check if the element is still in the DOM after a brief delay
                        setTimeout(() => {
                            if (span.parentNode) {
                                console.log('Clean highlight span still in DOM after 100ms:', span.outerHTML);
                            } else {
                                console.log('WARNING: Clean highlight span was removed from DOM');
                            }
                        }, 100);

                        // Only highlight the first occurrence to avoid issues
                        break;
                    }
                }
            }

            if (highlightCount === 0) {
                console.log('Target text not found in clean nodes:', `"${targetText}"`);
            }

            // Check total highlights in DOM
            setTimeout(() => {
                const allHighlights = contentDOM.querySelectorAll('.prose-lint-error');
                console.log('Total highlights currently in DOM after highlighting:', allHighlights.length);
                if (allHighlights.length > 0 && allHighlights.length <= 3) {
                    // Only log a few to avoid spam
                    Array.from(allHighlights).slice(0, 3).forEach((h, i) => {
                        console.log(`Sample highlight ${i}:`, h.outerHTML.substring(0, 150) + '...');
                    });
                }
            }, 50);

        } catch (e) {
            console.warn('Failed to highlight by content:', e);
        }
    }    private highlightTextRange(contentDOM: Element, fromOffset: number, toOffset: number, error: ProseLintError): void {
        try {
            // Create a simple approach: find text nodes and wrap the target range
            const walker = document.createTreeWalker(
                contentDOM,
                NodeFilter.SHOW_TEXT
            );

            let currentOffset = 0;
            let textNode: Text | null = null;
            let nodes: { node: Text, start: number, end: number }[] = [];

            // Build a map of text nodes and their positions
            while (textNode = walker.nextNode() as Text) {
                const textLength = textNode.textContent?.length || 0;
                nodes.push({
                    node: textNode,
                    start: currentOffset,
                    end: currentOffset + textLength
                });
                currentOffset += textLength;
            }

            console.log('Found', nodes.length, 'text nodes, total content length:', currentOffset);
            console.log('Looking for range:', fromOffset, 'to', toOffset);

            // Find nodes that intersect with our target range
            const targetNodes = nodes.filter(n =>
                (n.start < toOffset && n.end > fromOffset)
            );

            console.log('Target nodes for highlighting:', targetNodes.length);

            if (targetNodes.length > 0) {
                // For now, let's add a simple visual indicator by changing the background
                targetNodes.forEach(nodeInfo => {
                    const span = document.createElement('span');
                    span.className = `prose-lint-error prose-lint-${error.severity}`;
                    span.title = error.message;
                    span.style.backgroundColor = 'rgba(255, 165, 0, 0.3)'; // Orange highlight
                    span.style.borderBottom = '2px wavy orange';

                    // Calculate the portion of this text node to highlight
                    const nodeStart = Math.max(0, fromOffset - nodeInfo.start);
                    const nodeEnd = Math.min(nodeInfo.node.textContent?.length || 0, toOffset - nodeInfo.start);

                    if (nodeStart < nodeEnd) {
                        const textToHighlight = nodeInfo.node.textContent?.substring(nodeStart, nodeEnd) || '';
                        console.log('Highlighting text segment:', `"${textToHighlight}"`);

                        span.textContent = textToHighlight;

                        // Replace the text portion with our highlighted span
                        const beforeText = nodeInfo.node.textContent?.substring(0, nodeStart) || '';
                        const afterText = nodeInfo.node.textContent?.substring(nodeEnd) || '';

                        const parent = nodeInfo.node.parentNode;
                        if (parent) {
                            // Create text nodes for before and after
                            if (beforeText) {
                                parent.insertBefore(document.createTextNode(beforeText), nodeInfo.node);
                            }
                            parent.insertBefore(span, nodeInfo.node);
                            if (afterText) {
                                parent.insertBefore(document.createTextNode(afterText), nodeInfo.node);
                            }
                            parent.removeChild(nodeInfo.node);

                            console.log('Successfully highlighted text:', `"${textToHighlight}"`);
                        }
                    }
                });
            } else {
                console.log('No target nodes found for highlighting range', fromOffset, 'to', toOffset);
            }

        } catch (e) {
            console.warn('Failed to highlight text range:', e);
        }
    }

    /**
     * Clear all error highlights
     */
    private clearErrorHighlights(editor: Editor): void {
        console.log('clearErrorHighlights called, current decorations count:', this.errorDecorations.length);

        // Clear tooltips and tooltip map
        this.hideTooltip();
        this.tooltipMap.clear();

        // Clear Obsidian highlights and CodeMirror markers
        const editorAny = editor as any;
        const highlightClasses = new Set<string>();

        for (const decoration of this.errorDecorations) {
            try {
                if (decoration.highlightClass) {
                    highlightClasses.add(decoration.highlightClass);
                    console.log('Found Obsidian highlight class to remove:', decoration.highlightClass);
                } else if (decoration.marker && decoration.marker.clear) {
                    decoration.marker.clear();
                    console.log('Cleared CodeMirror marker');
                } else if (decoration.clear) {
                    decoration.clear();
                    console.log('Cleared decoration via clear method');
                }
            } catch (e) {
                console.log('Error clearing decoration:', e);
            }
        }

        // Remove all Obsidian highlights
        if (editorAny.removeHighlights && highlightClasses.size > 0) {
            for (const cssClass of highlightClasses) {
                console.log('Removing Obsidian highlights for class:', cssClass);
                editorAny.removeHighlights(cssClass);
            }
        }

        // Clear visual indicators from fallback highlighting
        const editorView = (editor as any).cm;
        if (editorView && editorView.dom) {
            const editorContainer = editorView.dom;

            // Remove visual styling
            editorContainer.style.borderLeft = '';
            editorContainer.style.backgroundColor = '';

            // Remove status element
            const statusEl = editorContainer.querySelector('.prose-lint-status');
            if (statusEl) {
                statusEl.remove();
                console.log('Removed visual status indicator');
            }
        }

        this.errorDecorations = [];
        console.log('clearErrorHighlights completed, decorations cleared');
    }

    /**
     * Convert character offset to editor position
     */
    private offsetToPosition(editor: Editor, offset: number): EditorPosition | null {
        try {
            const text = editor.getValue();
            let line = 0;
            let ch = 0;

            for (let i = 0; i < offset && i < text.length; i++) {
                if (text[i] === '\n') {
                    line++;
                    ch = 0;
                } else {
                    ch++;
                }
            }

            return { line, ch };
        } catch (e) {
            return null;
        }
    }

    /**
     * Event handler for when errors are updated
     */
    private onErrorsUpdated(errors: ProseLintError[]): void {
        // This can be extended to emit events for UI components
        // For now, we'll just update any registered listeners
        if ((this as any).onErrorsUpdatedCallback) {
            (this as any).onErrorsUpdatedCallback(errors);
        }
    }

    /**
     * Set callback for error updates
     */
    setErrorsUpdatedCallback(callback: (errors: ProseLintError[]) => void): void {
        (this as any).onErrorsUpdatedCallback = callback;
    }

    /**
     * Update options
     */
    updateOptions(newOptions: Partial<EditorLintingOptions>): void {
        this.options = { ...this.options, ...newOptions };

        // Re-lint if we have an active editor
        if (this.activeEditor) {
            this.performLint(this.activeEditor);
        }
    }

    /**
     * Dispose of the editor linting instance and clean up resources
     */
    dispose(): void {
        console.log('EditorLinting dispose called');

        // Clear any pending debounce timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }

        // Clear highlights if we have an active editor
        if (this.activeEditor) {
            this.clearErrorHighlights(this.activeEditor);
        }

        // Clean up tooltips and event listeners
        this.cleanupTooltips();

        // Clear state
        this.currentErrors = [];
        this.errorDecorations = [];
        this.activeEditor = null;

        console.log('EditorLinting dispose completed');
    }
}
