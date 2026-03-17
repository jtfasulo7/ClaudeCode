# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is a workspace for projects built with Claude Code. Individual projects live as subdirectories here.

## Git workflow

All work is version-controlled and pushed to GitHub (https://github.com/jtfasulo7/ClaudeCode).

- Commit after every meaningful change (new feature, bug fix, refactor)
- Use clear, concise commit messages focused on *why*, not just *what*
- Push to `origin/master` after each commit so there is always a recoverable remote state
- Always co-author commits with: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

## Adding a new project

Create a subdirectory for each project. As the project takes shape, update this file with:
- How to install dependencies
- How to build / run / test the project
- Any architecture notes that span multiple files
