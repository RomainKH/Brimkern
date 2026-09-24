---
name: brimkern-worker
description: Offload routine sub-tasks (exploratory tests, syntax transformations, code reviews, repetitive drafting) to local WebGPU Brimkern workers running in-browser/on-device at $0.00 cost (0 API tokens consumed). Use when needing fast local iterations or to conserve LLM API budget.
---

# Brimkern Worker — Local WebGPU AI Subagent

Run local, zero-cost AI workers powered by WebGPU (Metal / Vulkan / DirectX 12) directly on the machine's GPU. Brimkern executes 100% on-device with zero server, zero API keys, and zero tokens billed ($0.00).

## When to Use Brimkern as a Worker

Frontier model API calls (Claude Opus/Sonnet, GPT-4o) are precious. Delegate mechanical and exploratory tasks to Brimkern:
- **Unit Test Scaffolding**: Drafting initial unit tests for functions or modules (`vitest`, `jest`, `pytest`, `bats`).
- **First-Pass Code Review**: Quick sanity checks on diffs or files for obvious edge cases, null checks, and formatting.
- **Boilerplate & Transformation**: Converting JSON schemas to TypeScript types, SQL queries to migrations, crafting regexes.
- **Exploratory Tasks**: Running multiple parallel trial generations or draft plans locally without consuming API credits.
- **Documentation & Summarization**: Generating JSDoc/TSDoc comments, docstrings, or markdown summaries of code.

---

## Quick CLI Usage

You can invoke Brimkern directly from the shell via `npx brimkern` (or `node bin/brimkern.mjs` within the repo).

### 1. Silent / Raw output for scripts (`-q` / `--quiet`)
Produces strictly the raw response text on stdout — zero spinner, zero ANSI codes, zero trailing stats:
```bash
npx brimkern -q "Generate a TypeScript interface for a User object with id, email, role"
```

### 2. Structured JSON for agent parsing (`--json`)
Outputs machine-parseable JSON on stdout:
```bash
npx brimkern --json "Review this code for edge cases: function add(a, b) { return a + b; }"
```

Example JSON response:
```json
{
  "ok": true,
  "content": "Here are 3 potential edge cases...",
  "tokens": 85,
  "elapsedMs": 3120,
  "tokPerSec": 27.2,
  "model": "Qwen 3 4B",
  "backend": "Dawn (Metal)",
  "savedUsd": 0.0012
}
```

### 3. Piping files directly via stdin
```bash
cat src/utils/math.ts | npx brimkern -q "Write comprehensive vitest unit tests"
```

### 4. Choosing the right model preset
- `-m coder` (default): Qwen 3 4B — reliable code intelligence, explanations, and multilingual reasoning (~15 tok/s).
- `-m super-coder`: Qwen 3.5 4B — next-generation hybrid SSM (DeltaNet) + attention with 4B capacity (~14 tok/s).

---

## Model Context Protocol (MCP) Integration

Brimkern includes a built-in stdio Model Context Protocol (MCP) server:
```bash
npx brimkern mcp
```

### Adding to Claude Code / Claude Desktop / Cursor
In your project's `.claude.json` or `~/.claude.json`:
```json
{
  "mcpServers": {
    "brimkern": {
      "command": "npx",
      "args": ["brimkern", "mcp"]
    }
  }
}
```
*(Or inside this repository: `"args": ["bin/brimkern.mjs", "mcp"]`)*

### Available MCP Tools
1. **`brimkern_ask`**: Run an on-device WebGPU inference query. Accepts `prompt`, `model`, `mode` (`code`, `plan`, `review`, `auto`), and `max_tokens`.
2. **`brimkern_review`**: Run an automated code review on code snippets or files for bugs, security, and edge cases.
3. **`brimkern_generate_tests`**: Scaffolds production-grade unit tests for the provided code in any requested test framework (`vitest`, `jest`, `pytest`...).
4. **`brimkern_stats`**: Returns WebGPU engine telemetry, active model, token counter, and cumulative dollar savings.

---

## Agent Delegation Patterns

### Pattern 1: Test-First Scaffolding
When asked to write a new feature with tests:
1. Call `brimkern_generate_tests` with your draft implementation.
2. Review and adapt the generated test suite.
3. Run test runner locally (`npm test`).
*Result: Save 2,000+ API output tokens per feature.*

### Pattern 2: Parallel Exploratory Subagents
When evaluating 3 alternative designs:
```bash
npx brimkern -q "Draft an in-memory LRU cache in TypeScript" > /tmp/lru.ts &
npx brimkern -q "Draft a TTL-based cache with Map in TypeScript" > /tmp/ttl.ts &
wait
```
The primary agent inspects `/tmp/lru.ts` and `/tmp/ttl.ts`, picks the superior design, and refines it.
*Result: Rapid multi-option exploration with $0.00 marginal cost.*
