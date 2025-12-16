import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, TFile } from 'obsidian';
import { ProselintEngine } from './src/proselintEngine';
import { CheckRegistry } from './src/checkRegistry';
import { LintConfig, ProseLintError } from './src/types';
import { checkVery, checkHedging, checkRedundancy } from './src/checks/testChecks';
import { LintResultModal } from './src/lintResultModal';
import { runEngineTests } from './tests/engineTests';
import { runStyleChecksTests } from './tests/styleChecksTests';
import { runEditorIntegrationTests } from './tests/editorIntegrationTests';
import { runComprehensiveTests } from './tests/comprehensiveTest';
import { debugRedundancyCheck } from './debug/redundancyDebug';
import { registerStyleChecks } from './src/styleChecks';
import { registerTypographySpellingChecks } from './src/typographySpellingChecks';
import { registerMiscChecks } from './src/miscChecks';
import { registerSocialAwarenessChecks } from './src/socialAwarenessChecks';
import { ErrorDisplayPanel, PROSE_LINT_VIEW_TYPE } from './src/errorDisplayPanel';
import { EditorLinting } from './src/editorLinting';
import './debug/directTest';

interface ProseLintSettings extends LintConfig {
	mySetting: string;
}

const DEFAULT_SETTINGS: ProseLintSettings = {
	mySetting: 'default',
	maxErrors: 100,
	checks: {
		'weasel_words.very': true,
		'hedging.misc': true,
		'redundancy.misc': true
	},
	severityOverrides: {}
}

export default class ProseLintPlugin extends Plugin {
	settings: ProseLintSettings;
	checkRegistry: CheckRegistry;
	lintEngine: ProselintEngine;
	editorLinting: EditorLinting;

	async onload() {
		await this.loadSettings();

		// Initialize the linting system
		this.initializeLintingSystem();

		// Initialize real-time editor linting with highlighting
		this.editorLinting = new EditorLinting(this.lintEngine, {
			debounceMs: 1000,
			maxErrors: this.settings.maxErrors,
			enableRealTime: true,
			highlightErrors: true,
			showTooltips: true
		});

		// Register the error panel view for displaying lint results
		this.registerView(
			PROSE_LINT_VIEW_TYPE,
			(leaf) => new ErrorDisplayPanel(leaf)
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ProseLintSettingTab(this.app, this));

		// Command to run prose lint check on current document
		this.addCommand({
			id: 'prose-lint-check',
			name: 'Run prose lint check',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.runLintCheck(editor);
			}
		});

		// Command to run prose lint check and show results
		this.addCommand({
			id: 'prose-lint-check-show-results',
			name: 'Run prose lint check and show results',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.runLintCheckWithResults(editor);
			}
		});

		// Test command: Engine tests
		this.addCommand({
			id: 'prose-lint-engine-tests',
			name: 'Run Engine Tests',
			callback: () => {
				runEngineTests();
			}
		});

		// Test command: Style checks tests
		this.addCommand({
			id: 'prose-lint-style-checks-tests',
			name: 'Run Style Checks Tests',
			callback: () => {
				runStyleChecksTests().then(() => {
					new Notice('Style checks tests completed - check console for results');
				}).catch(error => {
					new Notice('Style checks tests failed - check console for details');
					console.error('Style checks test error:', error);
				});
			}
		});

		// Test command: Integration tests
		this.addCommand({
			id: 'prose-lint-integration-tests',
			name: 'Run Integration Tests',
			callback: () => {
				runEditorIntegrationTests().then((success) => {
					if (success) {
						new Notice('Integration tests passed!');
					} else {
						new Notice('Some integration tests failed - check console');
					}
				}).catch((error: Error) => {
					new Notice('Integration tests failed - check console for details');
					console.error('Integration test error:', error);
				});
			}
		});

		// Test command: Comprehensive check tests
		this.addCommand({
			id: 'prose-lint-comprehensive-tests',
			name: 'Run Comprehensive Tests (All 30 Checks)',
			callback: () => {
				try {
					runComprehensiveTests();
					new Notice('Comprehensive tests complete - check console');
				} catch (error) {
					new Notice('Comprehensive tests failed - check console');
					console.error('Comprehensive test error:', error);
				}
			}
		});

		// Command to show error panel
		this.addCommand({
			id: 'prose-lint-show-panel',
			name: 'Show Prose Lint Error Panel',
			callback: () => this.showErrorPanel()
		});

		// Command to toggle real-time linting
		this.addCommand({
			id: 'prose-lint-toggle-realtime',
			name: 'Toggle Real-time Prose Linting',
			callback: () => this.toggleRealTimeLinting()
		});

		// Command to debug redundancy check
		this.addCommand({
			id: 'prose-lint-debug-redundancy',
			name: 'Debug redundancy check',
			callback: () => {
				debugRedundancyCheck();
				new Notice('Redundancy debug output logged to console');
			}
		});

		// Set up real-time linting event listeners
		this.setupRealTimeLinting();
	}

	/**
	 * Set up event listeners for real-time linting
	 */
	private setupRealTimeLinting(): void {
		// Listen for active file changes
		this.registerEvent(
			this.app.workspace.on('active-leaf-change', () => {
				this.onActiveEditorChange();
			})
		);

		// Listen for file opens
		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				if (file && file.extension === 'md') {
					setTimeout(() => this.onActiveEditorChange(), 100);
				}
			})
		);

		// Set up periodic checking for editor changes (since Obsidian doesn't expose direct editor change events)
		this.registerInterval(
			window.setInterval(() => {
				this.checkForEditorChanges();
			}, 2000) // Check every 2 seconds
		);

		// Initialize with current editor
		setTimeout(() => this.onActiveEditorChange(), 100);
	}

	/**
	 * Handle active editor changes
	 */
	private onActiveEditorChange(): void {
		console.log('onActiveEditorChange called');
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		console.log('Active view found:', !!activeView);
		console.log('Real-time linting enabled:', this.editorLinting.isRealTimeLintingEnabled());

		if (activeView && this.editorLinting.isRealTimeLintingEnabled()) {
			console.log('Enabling linting for active editor');
			this.editorLinting.enableLinting(activeView.editor);
		}
	}

	/**
	 * Check for editor content changes (fallback method)
	 */
	private lastEditorContent: string = '';
	private checkForEditorChanges(): void {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView && this.editorLinting.isRealTimeLintingEnabled()) {
			const currentContent = activeView.editor.getValue();
			if (currentContent !== this.lastEditorContent) {
				console.log('Content changed detected, triggering lint. Length:', currentContent.length);
				this.lastEditorContent = currentContent;
				this.editorLinting.triggerLint(activeView.editor);
			}
		}
	}

	private initializeLintingSystem() {
		// Create and configure the check registry
		this.checkRegistry = new CheckRegistry();

		// Register style checks (weasel words, redundancy, hedging, clichés, passive voice)
		registerStyleChecks(this.checkRegistry);

		// Register typography and spelling checks (dashes, ellipsis, symbols, misspellings)
		registerTypographySpellingChecks(this.checkRegistry);

		// Register misc checks (capitalization, preferred forms, phrasal adjectives, etc.)
		registerMiscChecks(this.checkRegistry);

		// Register social awareness checks (gender bias, LGBTQ+, race/ethnicity)
		registerSocialAwarenessChecks(this.checkRegistry);

		// Register test checks for development testing (disabled by default)
		this.checkRegistry.registerCheck('test.weasel_words.very', checkVery, {
			name: 'Test: Avoid "very"',
			description: 'Test implementation of "very" detection',
			category: 'test',
			enabled: false,
			severity: 'warning',
			source: 'William Allen White'
		});

		this.checkRegistry.registerCheck('test.hedging.misc', checkHedging, {
			name: 'Test: Avoid hedging',
			description: 'Test implementation of hedging detection',
			category: 'test',
			enabled: false,
			severity: 'suggestion',
			source: 'Steven Pinker'
		});

		this.checkRegistry.registerCheck('test.redundancy.misc', checkRedundancy, {
			name: 'Test: Avoid redundancy',
			description: 'Test implementation of redundancy detection',
			category: 'test',
			enabled: false,
			severity: 'warning'
		});

		// Create the lint engine
		this.lintEngine = new ProselintEngine(this.checkRegistry, this.settings);
	}

	private runLintCheck(editor: Editor) {
		const text = editor.getValue();
		const result = this.lintEngine.lint(text);

		if (result.errors.length === 0) {
			new Notice('No prose lint issues found!');
		} else {
			new Notice(`Found ${result.errors.length} prose lint issue${result.errors.length > 1 ? 's' : ''}`);
		}

		// Update error highlights
		this.editorLinting.updateErrorHighlights(editor, result.errors);
	}

	private runLintCheckWithResults(editor: Editor) {
		const text = editor.getValue();
		const result = this.lintEngine.lint(text);

		new LintResultModal(this.app, result).open();
	}

	/**
	 * Show or create the error panel
	 */
	private async showErrorPanel() {
		const existingLeaf = this.app.workspace.getLeavesOfType(PROSE_LINT_VIEW_TYPE)[0];

		if (existingLeaf) {
			// Panel already exists, just reveal it
			this.app.workspace.revealLeaf(existingLeaf);
		} else {
			// Create new panel
			const leaf = this.app.workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({
					type: PROSE_LINT_VIEW_TYPE,
					active: true,
				});
				this.app.workspace.revealLeaf(leaf);
			}
		}

		// Trigger a lint if there's an active document
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const text = activeView.editor.getValue();
			const result = this.lintEngine.lint(text);

			// Update error highlights
			this.editorLinting.updateErrorHighlights(activeView.editor, result.errors);

			// Update error panel if it exists
			const panel = this.getErrorPanel();
			if (panel) {
				const file = activeView.file;
				panel.updateErrors(result.errors, file?.name || 'Current Document');
			}
		}
	}

	/**
	 * Toggle real-time linting on/off
	 */
	private toggleRealTimeLinting() {
		console.log('toggleRealTimeLinting called');
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			new Notice('No active editor found');
			return;
		}

		const editor = activeView.editor;
		const wasEnabled = this.editorLinting.isRealTimeLintingEnabled();
		console.log('Was enabled before toggle:', wasEnabled);

		this.editorLinting.toggleRealTimeLinting();
		const nowEnabled = this.editorLinting.isRealTimeLintingEnabled();
		console.log('Now enabled after toggle:', nowEnabled);

		if (nowEnabled) {
			console.log('Enabling real-time linting');
			this.editorLinting.enableLinting(editor);
			new Notice('Real-time prose linting enabled');
		} else {
			console.log('Disabling real-time linting');
			this.editorLinting.disableLinting(editor);
			new Notice('Real-time prose linting disabled');
		}
	}

	/**
	 * Get the error panel instance if it exists
	 */
	private getErrorPanel(): ErrorDisplayPanel | null {
		const leaf = this.app.workspace.getLeavesOfType(PROSE_LINT_VIEW_TYPE)[0];
		return leaf?.view instanceof ErrorDisplayPanel ? leaf.view : null;
	}

	onunload() {
		console.log('ProseLint plugin unloading...');

		// Cleanup editor linting
		if (this.editorLinting) {
			this.editorLinting.dispose();
		}

		console.log('ProseLint plugin unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ProseLintSettingTab extends PluginSettingTab {
	plugin: ProseLintPlugin;

	constructor(app: App, plugin: ProseLintPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Prose Lint Settings' });

		// Max errors setting
		new Setting(containerEl)
			.setName('Maximum errors')
			.setDesc('Maximum number of errors to report per document')
			.addText(text => text
				.setPlaceholder('100')
				.setValue(this.plugin.settings.maxErrors.toString())
				.onChange(async (value) => {
					const maxErrors = parseInt(value);
					if (!isNaN(maxErrors) && maxErrors > 0) {
						this.plugin.settings.maxErrors = maxErrors;
						await this.plugin.saveSettings();
						this.plugin.lintEngine.updateConfig({ maxErrors });
					}
				}));

		// Check configuration section
		containerEl.createEl('h3', { text: 'Enabled Checks' });

		// Group checks by category
		const categories = this.plugin.checkRegistry.getAllCategories();

		for (const category of categories) {
			const categoryDiv = containerEl.createDiv('prose-lint-category');
			categoryDiv.createEl('h4', { text: category.name });

			for (const check of category.checks) {
				new Setting(categoryDiv)
					.setName(check.name)
					.setDesc(check.description + (check.source ? ` (Source: ${check.source})` : ''))
					.addToggle(toggle => toggle
						.setValue(this.plugin.settings.checks[check.id] !== false)
						.onChange(async (value) => {
							this.plugin.settings.checks[check.id] = value;
							await this.plugin.saveSettings();
							this.plugin.lintEngine.updateConfig({ checks: this.plugin.settings.checks });
						}));
			}
		}

		// Test section
		containerEl.createEl('h3', { text: 'Test the Engine' });

		const testDiv = containerEl.createDiv();
		const testArea = testDiv.createEl('textarea', {
			attr: {
				placeholder: 'Enter some text to test the linting engine...',
				rows: '5',
				style: 'width: 100%; margin-bottom: 10px;'
			}
		});

		const testButton = testDiv.createEl('button', { text: 'Test Lint Engine' });
		testButton.onclick = () => {
			const testText = testArea.value;
			if (testText.trim()) {
				const result = this.plugin.lintEngine.lint(testText);
				new LintResultModal(this.app, result).open();
			} else {
				new Notice('Please enter some text to test');
			}
		};
	}
}
