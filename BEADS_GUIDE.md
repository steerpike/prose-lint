# Beads Task Management Guide

Quick reference for managing Phase 1 implementation tasks with beads.

---

## Overview

**31 tasks created** for Phase 1 implementation:
- 20 check implementations (Week 1-3)
- 3 integration tasks
- 2 testing/performance tasks
- 6 pre-release tasks (personal use)

---

## Quick Commands

### View Tasks

```bash
# Overall status
bd status

# List all Phase 1 tasks
bd list --label phase1

# Week 1 tasks (Typography + Core Spelling)
bd list --label week1

# Week 2 tasks (Misc category)
bd list --label week2

# Week 3 tasks (Security + Social Awareness)
bd list --label week3

# Pre-release tasks
bd list --label pre-release

# High priority tasks
bd list --label high-priority

# Show ready work (no blockers)
bd ready
```

### Working on Tasks

```bash
# Start working on a task (marks as in-progress)
bd update prose-lint-1i3 --status in-progress

# Add a comment/note
bd comment prose-lint-1i3 "Started implementation, porting patterns from proselint"

# Close a completed task
bd close prose-lint-1i3

# View task details
bd show prose-lint-1i3
```

### Filter by Category

```bash
# Typography checks
bd list --label typography

# Spelling checks
bd list --label spelling

# Misc checks
bd list --label misc

# Security checks
bd list --label security

# Social awareness checks
bd list --label social-awareness

# Integration tasks
bd list --label integration

# Testing tasks
bd list --label testing
```

---

## Recommended Workflow

### Starting Your Day

```bash
# See what's ready to work on
bd ready

# View Week 1 tasks
bd list --label week1

# Pick first task and start it
bd update prose-lint-1i3 --status in-progress
```

### While Working

```bash
# Add notes as you work
bd comment prose-lint-1i3 "Implemented 4 dash patterns, testing now"

# Check what's left in current week
bd list --label week1 --status open
```

### Completing a Task

```bash
# Close the task
bd close prose-lint-1i3

# Check progress
bd status

# Start next task
bd update prose-lint-nq5 --status in-progress
```

---

## Task Breakdown by Week

### Week 1: Typography & Core Spelling (8 tasks)
1. `prose-lint-1i3` - dashes.ts ⏱️ 1.5h
2. `prose-lint-nq5` - ellipsis.ts ⏱️ 1h
3. `prose-lint-mxk` - symbols.ts ⏱️ 1.5h
4. `prose-lint-00x` - misspelling.ts ⏱️ 2h
5. `prose-lint-xr4` - typos.ts ⏱️ 1.5h
6. `prose-lint-d49` - ableIble.ts ⏱️ 1h
7. `prose-lint-ct2` - erOr.ts ⏱️ 1h
8. `prose-lint-toc` - Week 1 Integration ⏱️ 3h

**Total**: ~12-13 hours

### Week 2: Misc Category (9 tasks)
View with: `bd list --label week2`
**Total**: ~14-15 hours

### Week 3: Security, Social Awareness & Testing (8 tasks)
View with: `bd list --label week3`
**Total**: ~14-15 hours

### Pre-Release: Documentation & Build (6 tasks)
View with: `bd list --label pre-release`
**Total**: ~5-6 hours

---

## Progress Tracking

```bash
# See overall progress
bd stats

# Count completed tasks
bd count --status closed

# Count remaining tasks
bd count --status open

# View by priority
bd list --priority P1  # Critical
bd list --priority P2  # High (most tasks)
```

---

## Tips

### Start Each Session
```bash
# Quick overview
bd status

# What's ready to work on?
bd ready

# What was I working on?
bd list --status in-progress
```

### End of Week
```bash
# Check Week 1 completion
bd list --label week1 --status closed
bd list --label week1 --status open

# Review time spent (via comments)
bd show prose-lint-1i3
```

### Staying Organized
- Only mark **one task** as `in-progress` at a time
- Add comments when you encounter issues
- Close tasks immediately when complete
- Use `bd ready` to find next task

---

## Example Session

```bash
# Morning: Start working
$ bd ready
# Shows all available tasks

$ bd update prose-lint-1i3 --status in-progress
# Started working on dashes.ts

# During work: Add progress notes
$ bd comment prose-lint-1i3 "Ported 6 patterns, testing with examples"

# Task complete
$ bd close prose-lint-1i3
# Closed dashes.ts

# Check progress
$ bd status
# Shows 1 closed, 30 open

# Start next task
$ bd update prose-lint-nq5 --status in-progress
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `bd status` | Overall project status |
| `bd ready` | Show tasks ready to work on |
| `bd list --label week1` | View specific week |
| `bd update ID --status in-progress` | Start task |
| `bd comment ID "note"` | Add note |
| `bd close ID` | Complete task |
| `bd show ID` | View details |

---

## Integration with Docs

The beads tasks align with:
- **RELEASE_ROADMAP.md** - Detailed task descriptions
- **QUICK_START_GUIDE.md** - How to implement each check
- **PROGRESS_TRACKER.md** - Manual tracking (optional)

Use beads for task management, reference the docs for implementation details.

---

**Pro Tip**: Run `bd ready` at the start of each coding session to see what's next!
