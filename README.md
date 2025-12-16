# Prose Lint

An Obsidian plugin that improves your writing quality by implementing rules from the acclaimed [proselint](https://github.com/amperser/proselint) project. Get real-time feedback on style, clarity, grammar, and inclusive language as you write.

## Features

### Current (v0.9.0-dev)
- ✅ **Real-time linting** - See issues as you type with in-editor highlighting
- ✅ **Error panel** - Dedicated view showing all issues with click-to-navigate
- ✅ **30 production checks** across 4 categories:
  - **Style** (11 checks): Weasel words, redundancy, hedging, clichés, passive voice
  - **Typography & Spelling** (8 checks): Dashes, ellipsis, symbols, misspellings, typos, suffix confusion
  - **Misc** (8 checks): Capitalization, preferred forms, phrasal adjectives, pretension, illogic, scare quotes, apologizing, metadiscourse
  - **Social Awareness** (3 checks): Gender-neutral language, LGBTQ+ inclusive language, race/ethnicity sensitivity
- ✅ **Customizable** - Enable/disable individual checks
- ✅ **Performance optimized** - Handles 5,000+ word documents efficiently
- ✅ **Professional UI** - Seamless Obsidian integration

## Checks Implemented

### Style (11 checks)
- Weasel words (very, extremely, quite, etc.)
- Redundancy (12 noon, end result, free gift, etc.)
- Hedging (I think, maybe, possibly, etc.)
- Clichés (at this point in time, few and far between, etc.)
- Passive voice detection (was made, is being done, etc.)

### Typography & Spelling (8 checks)
- Multiple hyphens → em dash (---, --)
- Numeric ranges with hyphens (1-5 → 1–5)
- Three dots → ellipsis (...  → …)
- Symbol substitutions (© ™ ®  ×)
- Top 100+ common misspellings
- Common typos (teh, recieve, etc.)
- -able vs -ible suffix confusion
- -er vs -or suffix confusion

### Misc (8 checks)
- Capitalization (proper nouns, seasons, months)
- Preferred word forms (imprimatur, long-standing, etc.)
- Phrasal adjective hyphenation (long-term care, high-school student)
- Pretentious jargon (reconceptualize, synergy, paradigm shift)
- Illogical constructions (could care less, preplan)
- Scare quote misuse
- Excessive apologizing (More research is needed, etc.)
- Metadiscourse (This chapter discusses, etc.)

### Social Awareness (3 checks)
- Gender-neutral language (chairman → chair, fireman → firefighter)
- LGBTQ+ inclusive terminology
- Race/ethnicity sensitivity

## Installation

### Manual Installation (Development)
1. Clone this repository into your vault's `.obsidian/plugins/` directory:
   ```bash
   cd /path/to/vault/.obsidian/plugins
   git clone https://github.com/steerpike/prose-lint.git
   cd prose-lint
   npm install
   npm run build
   ```
2. Restart Obsidian
3. Enable "Prose Lint" in Settings → Community Plugins

### From Community Plugins (Coming Soon)
Once released, search for "Prose Lint" in Obsidian's Community Plugins.

## Usage

### Commands
- **Run prose lint check** - Manually analyze current document
- **Show Prose Lint Error Panel** - Open/reveal the error panel
- **Toggle Real-time Prose Linting** - Enable/disable automatic checking
- **Run Comprehensive Tests** - Test all 30 checks (development)

### Settings
Configure which checks to run and customize severity levels in Settings → Prose Lint.

## Development

### Project Structure
```
prose-lint/
├── src/
│   ├── checks/          # Check implementations
│   ├── checkRegistry.ts # Check management
│   ├── proselintEngine.ts
│   ├── editorLinting.ts # Real-time integration
│   └── errorDisplayPanel.ts
├── IMPLEMENTATION_STATUS.md  # Detailed status
├── RELEASE_ROADMAP.md       # Phase 1 plan
├── QUICK_START_GUIDE.md     # How to add checks
└── PROGRESS_TRACKER.md      # Daily tracking
```

### Build Commands
```bash
# Install dependencies
npm install

# Development build (watch mode)
npm run dev

# Production build
npm run build

# Run tests
npm test
```

### Contributing
Want to help implement the remaining checks? See:
1. **IMPLEMENTATION_STATUS.md** - What's done and what's missing
2. **QUICK_START_GUIDE.md** - How to implement a new check (30 min)
3. **RELEASE_ROADMAP.md** - Prioritized implementation plan

## Credits

Based on [proselint](https://github.com/amperser/proselint) by Jordan Suchow and contributors. Proselint aggregates writing advice from world-class authors and editors.

## License

MIT

---

*Better writing through better tools.*
