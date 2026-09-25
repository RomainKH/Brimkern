---
name: brimkern-worker
description: Offload routine sub-tasks (exploratory tests, syntax transformations, code reviews, repetitive drafting) to local WebGPU Brimkern workers running in-browser/on-device at $0.00 cost (0 API tokens consumed). Use when needing fast local iterations or to conserve LLM API budget.
---

# Brimkern Worker — Local WebGPU AI Subagent

Run a local AI worker on the machine's GPU through WebGPU (Metal / Vulkan). Brimkern runs 100%
on-device: no server, no API key, no tokens billed.

It is a 4B model: good for drafts and first passes, not for final answers. Always review what it
returns before using it.

## When to Use Brimkern as a Worker

- **Unit test scaffolding**: first draft of tests for a function or module (`vitest`, `jest`, `pytest`, `bats`).
- **First-pass code review**: quick sanity check of a diff or file for obvious edge cases and null checks.
- **Boilerplate & transformation**: JSON schema → TypeScript types, SQL → migration, regexes.
- **Documentation**: JSDoc/TSDoc comments, docstrings, markdown summaries of code.

---

## Install

The CLI is installed from the repository (the npm package `brimkern` is the browser SDK and has
no command, so `npx brimkern` does not work):

```bash
curl -fsSL https://brimkern.com/install.sh | bash   # puts `brimkern` in ~/.local/bin
```

Inside the Brimkern repository, `node bin/brimkern.mjs` works the same way. The first run
downloads the default model once (2.53 GB) into `~/.cache/brimkern`.

## Quick CLI Usage

### 1. Answer only, for scripts (`-q` / `--quiet`)
Prints only the answer on stdout: no spinner, no ANSI codes, no stats, no `<think>` block.
```bash
brimkern -q "Generate a TypeScript interface for a User object with id, email, role"
```

### 2. Structured JSON for agent parsing (`--json`)
```bash
brimkern --json "Review this code for edge cases: function add(a, b) { return a + b; }"
```

Response shape:
```json
{
  "ok": true,
  "content": "…the answer…",
  "tokens": 85,
  "elapsedMs": 6120,
  "tokPerSec": 13.9,
  "model": "Qwen 3 4B (BRIK int4)",
  "backend": "Dawn (Metal)",
  "savedUsd": 0.0012
}
```
`savedUsd` is an estimate (what the same call would cost on a paid API), not a measurement.

### 3. Piping files via stdin
```bash
cat src/utils/math.ts | brimkern -q "Write vitest unit tests for this module"
```

### 4. Choosing the model
Scores: our five code suites (HumanEval, HumanEval+, MBPP+, TypeScript, bug fixing; 202 problems, every answer executed against tests). Claude Sonnet 5 scores 186/202 on the same suites.

- `-m coder` (default): Qwen 3 4B — light (~2.5 GB), runs anywhere. 146/202. Use it for small, well-specified tasks.
- `-m coder-max`: Qwen 3.6 35B-A3B MoE — the strongest: 184/202, 34/41 at bug fixing (coder: 21/41). Needs a machine with 20 GB+ of memory (~12 GB in use); the CLI refuses to load it on less. Prefer it for bug fixes and anything non-trivial when the machine allows.
- `-m super-coder`: Qwen 3.5 4B — always reasons first, slow. 145/202. Rarely worth it now.

Run one CLI call at a time: each call loads the model into memory (~2.5 GB for coder, ~12 GB for coder-max).

---

## Model Context Protocol (MCP) server

```bash
brimkern mcp                       # stdio server, model `coder`
brimkern mcp --model=coder-max     # strongest, 20 GB+ of memory
```

### Adding it to Claude Code
```bash
claude mcp add brimkern -- brimkern mcp
```
Or in a project's `.mcp.json` (Claude Desktop / Cursor use the same `mcpServers` block):
```json
{
  "mcpServers": {
    "brimkern": { "command": "brimkern", "args": ["mcp"] }
  }
}
```
Inside the Brimkern repository: `"command": "node", "args": ["bin/brimkern.mjs", "mcp"]`.

### Tools
1. **`brimkern_ask`**: on-device query. Accepts `prompt`, `model`, `mode` (`code`, `plan`, `review`, `auto`), `max_tokens` (default 512).
2. **`brimkern_review`**: code review of `code` (optional `file_path`) for bugs, security and edge cases.
3. **`brimkern_generate_tests`**: unit tests for `code` in `test_framework` (default `vitest`).
4. **`brimkern_stats`**: active model, calls and tokens served, estimated savings. Does not load a model.

Each call is independent (no memory of earlier calls). Calls run one after another on a single
model kept in VRAM; the first call pays the model load. An answer cut by `max_tokens` ends with
`[truncated at max_tokens]`.

---

## Delegation Pattern: test-first scaffolding

1. Call `brimkern_generate_tests` with the draft implementation.
2. Review and fix the generated suite (expect wrong imports or assertions).
3. Run the project's test runner.
