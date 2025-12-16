# Prose Lint Release Roadmap
**Target**: Obsidian Community Plugin Release v0.9.0

---

## 🎯 Release Goal: Phase 1 Complete (MVP)

**Definition of Done**:
- 20 new high-impact check files implemented
- All existing functionality stable
- Performance optimized for real-time use
- Documentation complete
- Ready for community plugin submission

**Timeline**: 2-3 weeks from start
**Coverage**: 26 total files (34% of proselint, but 70%+ of user value)

---

## Week 1: Typography & Core Spelling

### Day 1-2: Typography Checks (CRITICAL)

**Task 1.1: Implement Dash Usage Check** `[dashes.ts]`
- [ ] Port patterns from `proselint/checks/typography/dashes.py`
- [ ] Em dash (—) vs en dash (–) vs hyphen (-)
- [ ] Spacing rules around dashes
- [ ] Test with example text
- **Estimated**: 1.5 hours

**Task 1.2: Implement Ellipsis Check** `[ellipsis.ts]`
- [ ] Port patterns from `proselint/checks/typography/ellipsis.py`
- [ ] Three dots vs ellipsis character (…)
- [ ] Spacing rules
- [ ] Test with example text
- **Estimated**: 1 hour

**Task 1.3: Implement Symbol Check** `[symbols.ts]`
- [ ] Port patterns from `proselint/checks/typography/symbols.py`
- [ ] Copyright (©), registered (®), trademark (™)
- [ ] Proper formatting and usage
- [ ] Test with example text
- **Estimated**: 1.5 hours

**Task 1.4: Register Typography Checks**
- [ ] Create `phase5aTypography.ts` registration file
- [ ] Add to main.ts initialization
- [ ] Update settings UI category
- [ ] Test settings toggles
- **Estimated**: 30 minutes

**Milestone**: Typography complete (4 hours total)

---

### Day 3-4: Core Spelling Checks (HIGH VALUE)

**Task 1.5: Common Misspellings** `[misspelling.ts]`
- [ ] Port patterns from `proselint/checks/spelling/misspelling.py`
- [ ] Top 100+ common misspellings
- [ ] Provide correct spellings as replacements
- [ ] Test with example text
- **Estimated**: 2 hours

**Task 1.6: Common Typos** `[typos.ts]`
- [ ] Port patterns from `proselint/checks/spelling/typos.py`
- [ ] Keyboard proximity typos
- [ ] Transposition errors
- [ ] Test with example text
- **Estimated**: 1.5 hours

**Task 1.7: able/ible Confusion** `[ableIble.ts]`
- [ ] Port patterns from `proselint/checks/spelling/able_ible.py`
- [ ] Words ending in -able vs -ible
- [ ] Common confusions
- [ ] Test with example text
- **Estimated**: 1 hour

**Task 1.8: er/or Confusion** `[erOr.ts]`
- [ ] Port patterns from `proselint/checks/spelling/er_or.py`
- [ ] Words ending in -er vs -or
- [ ] Common confusions
- [ ] Test with example text
- **Estimated**: 1 hour

**Task 1.9: Register Spelling Checks**
- [ ] Create `phase5aSpelling.ts` registration file
- [ ] Add to main.ts initialization
- [ ] Update settings UI category
- [ ] Test settings toggles
- **Estimated**: 30 minutes

**Milestone**: Core spelling complete (6 hours total)

---

### Day 5: Testing & Performance Week 1

**Task 1.10: Integration Testing**
- [ ] Create comprehensive test document
- [ ] Test all 10 new checks together
- [ ] Verify real-time performance
- [ ] Check for conflicts or overlaps
- **Estimated**: 2 hours

**Task 1.11: Performance Optimization**
- [ ] Profile linting speed with new checks
- [ ] Optimize regex patterns if needed
- [ ] Test with large documents (10k+ words)
- [ ] Ensure <500ms response time
- **Estimated**: 2 hours

**Week 1 Deliverable**: 10 working checks (Typography + Core Spelling)
**Week 1 Total Time**: ~16 hours

---

## Week 2: Misc Category High-Impact Subset

### Day 6-7: Capitalization & Preferred Forms

**Task 2.1: Capitalization Check** `[capitalization.ts]`
- [ ] Port patterns from `proselint/checks/misc/capitalization.py`
- [ ] Proper nouns
- [ ] Sentence starts
- [ ] Title case rules
- **Estimated**: 2 hours

**Task 2.2: Preferred Forms Check** `[preferredForms.ts]`
- [ ] Port patterns from `proselint/checks/misc/preferred_forms.py`
- [ ] American English preferences
- [ ] Standard vs non-standard forms
- [ ] "e.g." vs "eg", "etc." formatting
- **Estimated**: 2 hours

**Task 2.3: Phrasal Adjectives** `[phrasalAdjectives.ts]`
- [ ] Port patterns from `proselint/checks/misc/phrasal_adjectives.py`
- [ ] Hyphenation rules (e.g., "well-known author")
- [ ] Compound modifier detection
- [ ] Test with examples
- **Estimated**: 1.5 hours

---

### Day 8-9: Style & Clarity

**Task 2.4: Pretentious Language** `[pretension.ts]`
- [ ] Port patterns from `proselint/checks/misc/pretension.py`
- [ ] Overly formal or pompous language
- [ ] Simpler alternatives
- [ ] Test with examples
- **Estimated**: 2 hours

**Task 2.5: Illogical Constructions** `[illogic.ts]`
- [ ] Port patterns from `proselint/checks/misc/illogic.py`
- [ ] Logical inconsistencies
- [ ] Contradictory statements
- [ ] Test with examples
- **Estimated**: 1.5 hours

**Task 2.6: Scare Quotes** `[scareQuotes.ts]`
- [ ] Port patterns from `proselint/checks/misc/scare_quotes.py`
- [ ] Unnecessary quotation marks
- [ ] Proper quote usage
- [ ] Test with examples
- **Estimated**: 1 hour

---

### Day 10: Additional Misc Checks

**Task 2.7: Unnecessary Apologizing** `[apologizing.ts]`
- [ ] Port patterns from `proselint/checks/misc/apologizing.py`
- [ ] Phrases like "I'm sorry to say"
- [ ] More confident alternatives
- [ ] Test with examples
- **Estimated**: 1 hour

**Task 2.8: Metadiscourse** `[metadiscourse.ts]`
- [ ] Port patterns from `proselint/checks/misc/metadiscourse.py`
- [ ] Self-referential writing
- [ ] "As mentioned before" type phrases
- [ ] Test with examples
- **Estimated**: 1.5 hours

**Task 2.9: Register Misc Checks**
- [ ] Create `phase5aMisc.ts` registration file
- [ ] Add to main.ts initialization
- [ ] Update settings UI category
- [ ] Test settings toggles
- **Estimated**: 30 minutes

**Milestone**: Misc subset complete (8 checks, ~13 hours)

---

## Week 3: Security & Social Awareness

### Day 11-12: Restricted Terms (Security)

**Task 3.1: Password Detection** `[passwords.ts]`
- [ ] Port patterns from `proselint/checks/restricted/passwords.py`
- [ ] Detect obvious passwords in text
- [ ] Warn about security risks
- [ ] Test with examples
- **Estimated**: 1.5 hours

**Task 3.2: Credit Card Detection** `[creditCards.ts]`
- [ ] Port patterns from `proselint/checks/restricted/credit_card.py`
- [ ] Detect credit card number patterns
- [ ] Warn about PCI compliance
- [ ] Test with examples
- **Estimated**: 1.5 hours

**Task 3.3: Register Restricted Checks**
- [ ] Create `phase5aRestricted.ts` registration file
- [ ] Add to main.ts initialization
- [ ] Update settings UI category
- [ ] Test settings toggles
- **Estimated**: 30 minutes

---

### Day 13-14: Social Awareness (Inclusive Language)

**Task 3.4: Gender Bias Check** `[genderBias.ts]`
- [ ] Port patterns from `proselint/checks/social_awareness/gender_bias.py`
- [ ] Gender-biased language
- [ ] Gender-neutral alternatives
- [ ] Test with examples
- **Estimated**: 2 hours

**Task 3.5: LGBTQ+ Sensitivity** `[lgbtq.ts]`
- [ ] Port patterns from `proselint/checks/social_awareness/lgbtq.py`
- [ ] Outdated or offensive terms
- [ ] Respectful alternatives
- [ ] Test with examples
- **Estimated**: 2 hours

**Task 3.6: Race/Ethnicity Sensitivity** `[raceEthnicity.ts]`
- [ ] Port patterns from `proselint/checks/social_awareness/race_ethnicity.py`
- [ ] Outdated or offensive terms
- [ ] Respectful alternatives
- [ ] Test with examples
- **Estimated**: 2 hours

**Task 3.7: Register Social Awareness Checks**
- [ ] Create `phase5aSocialAwareness.ts` registration file
- [ ] Add to main.ts initialization
- [ ] Update settings UI category
- [ ] Test settings toggles
- **Estimated**: 30 minutes

**Milestone**: Security & social awareness complete (5 checks, ~10 hours)

---

### Day 15: Final Testing & Integration

**Task 3.8: Comprehensive Testing**
- [ ] Test all 20 new checks together
- [ ] Test with 6 existing checks (26 total)
- [ ] Create diverse test document
- [ ] Verify no check conflicts
- [ ] Check error message quality
- **Estimated**: 3 hours

**Task 3.9: Performance Validation**
- [ ] Benchmark with 1k word document
- [ ] Benchmark with 5k word document
- [ ] Benchmark with 10k word document
- [ ] Ensure <500ms for 5k words
- [ ] Optimize if needed
- **Estimated**: 2 hours

**Task 3.10: Settings UI Polish**
- [ ] Verify all categories display correctly
- [ ] Test enable/disable for all checks
- [ ] Check descriptions are clear
- [ ] Verify source attributions
- **Estimated**: 1 hour

**Week 3 Deliverable**: All Phase 1 checks complete and tested
**Week 3 Total Time**: ~16 hours

---

## Pre-Release Checklist (Days 16-17)

### Documentation

- [ ] **Update README.md**
  - [ ] Feature list with all 26 checks
  - [ ] Installation instructions
  - [ ] Usage examples with screenshots
  - [ ] Configuration guide
  - [ ] Credits to proselint

- [ ] **Create CHANGELOG.md**
  - [ ] v0.9.0 feature list
  - [ ] Known limitations
  - [ ] Future roadmap

- [ ] **Update manifest.json**
  - [ ] Version to 0.9.0
  - [ ] Description
  - [ ] Author info
  - [ ] Required Obsidian version

---

### Testing

- [ ] **Installation Testing**
  - [ ] Test manual installation
  - [ ] Test with fresh Obsidian vault
  - [ ] Verify settings persist
  - [ ] Test on different OS (macOS/Windows/Linux)

- [ ] **Functional Testing**
  - [ ] All commands work
  - [ ] Real-time linting toggles properly
  - [ ] Error panel displays correctly
  - [ ] Settings save/load correctly
  - [ ] No console errors

- [ ] **Performance Testing**
  - [ ] Large document (10k+ words)
  - [ ] Multiple documents open
  - [ ] All checks enabled
  - [ ] Memory usage acceptable

---

### Release Preparation

- [ ] **Create Release Assets**
  - [ ] Build plugin: `npm run build`
  - [ ] Create main.js, manifest.json, styles.css
  - [ ] Test built version
  - [ ] Create release ZIP

- [ ] **Screenshots & Media**
  - [ ] Error highlighting screenshot
  - [ ] Error panel screenshot
  - [ ] Settings UI screenshot
  - [ ] Demo GIF/video

- [ ] **Community Plugin Submission**
  - [ ] Fork obsidian-releases repo
  - [ ] Add plugin to community-plugins.json
  - [ ] Submit pull request
  - [ ] Respond to review feedback

---

## Release Criteria

### Must Have ✅
- [ ] 26 total checks (6 existing + 20 new)
- [ ] Real-time linting working
- [ ] Error panel functional
- [ ] Settings UI complete
- [ ] Performance <500ms for 5k words
- [ ] No critical bugs
- [ ] README complete
- [ ] Obsidian API compliance

### Nice to Have 🎁
- [ ] Example vault with test documents
- [ ] Video tutorial
- [ ] User feedback from beta testers
- [ ] Additional example patterns

### Post-Release (v1.0+)
- [ ] Phase 2 checks (professional writing)
- [ ] Phase 3 checks (complete coverage)
- [ ] Vault-wide analysis
- [ ] Custom check import/export
- [ ] Advanced reporting

---

## Progress Tracking

### Implementation Status

**Week 1**: [ ] Typography (3) + Core Spelling (4) = 7 checks
**Week 2**: [ ] Misc subset (8 checks)
**Week 3**: [ ] Security (2) + Social Awareness (3) = 5 checks

**Total Phase 1**: [ ] 20 new checks + 6 existing = 26 total

### Current Statistics
- **Files**: 6 of 26 (23%)
- **Checks**: 11 of 31 (35%)
- **Coverage**: 7.9% of proselint → target 34%
- **User Value**: ~30% → target 70%

### Time Tracking
- **Week 1**: ___ / 16 hours
- **Week 2**: ___ / 13 hours
- **Week 3**: ___ / 16 hours
- **Release prep**: ___ / 8 hours
- **Total**: ___ / 53 hours

---

## Risk Management

### Technical Risks
- **Performance degradation**: Monitor after each new check
- **Pattern conflicts**: Test checks together regularly
- **Regex complexity**: Keep patterns simple, optimize later

### Mitigation
- [ ] Incremental testing after each check
- [ ] Performance benchmarks at end of each week
- [ ] Code review of complex patterns

### Release Risks
- **Incomplete testing**: Allocate full 2 days for testing
- **Community plugin review delays**: Submit early
- **User bug reports**: Have debug process ready

---

## Success Metrics

**v0.9.0 Release Success Criteria**:
- ✅ 26 checks implemented and tested
- ✅ <3 critical bugs reported in first week
- ✅ >50 downloads in first month
- ✅ >4.0 star rating
- ✅ Positive community feedback
- ✅ Performance acceptable on typical documents

**Long-term Success (6 months)**:
- ✅ 500+ active users
- ✅ Phase 2 complete (v1.0 released)
- ✅ Feature requests guide Phase 3 prioritization
- ✅ Community contributions
- ✅ Integration with other plugins

---

## Next Steps

1. **Start Now**: Begin with Task 1.1 (dashes.ts)
2. **Daily Progress**: Complete 2-3 tasks per day
3. **Weekly Review**: Check progress each Friday
4. **Adjust as Needed**: Re-prioritize based on difficulty

**Let's ship this! 🚀**
