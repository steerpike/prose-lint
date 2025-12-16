# Changelog

All notable changes to the Prose Lint plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2025-12-10

### Added
- **30 production checks** across 4 categories:
  - Style checks (11): Weasel words, redundancy, hedging, clichés, passive voice, and more
  - Typography & Spelling (8): Dashes, ellipsis, symbols, misspellings, typos, suffix confusion
  - Misc (8): Capitalization, preferred forms, phrasal adjectives, pretension, illogic, and more
  - Social Awareness (3): Gender-neutral, LGBTQ+ inclusive, race/ethnicity sensitive language
- Real-time linting with in-editor highlighting
- Dedicated error display panel with click-to-navigate
- Comprehensive test suite for all checks
- Performance optimization for large documents (5,000+ words)
- Customizable check enable/disable per check
- Settings UI for configuration

### Changed
- Renamed internal modules from "phase" naming to descriptive names
- Improved error message clarity across all checks
- Enhanced check registry system

### Technical
- TypeScript implementation with full type safety
- CheckRegistry system for modular check management
- ProselintEngine core with line/column calculation
- EditorLinting with CodeMirror integration
- Debounced linting (500ms default)
- Source attribution for all checks

## [0.1.0] - 2024-XX-XX

### Added
- Initial plugin structure
- Basic linting framework
- Test implementation of core checks
