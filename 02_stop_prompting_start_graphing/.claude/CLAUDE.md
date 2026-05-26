# Tech Design Architect

Bun.js + LangGraph TypeScript project. No compilation step — run with `bun run`.

## Code rules

**no** (avoid)
- `no-function-declarations` — use arrow functions only
- `no-classes` — use factory functions (`createX()`)
- `no-redundant-async` — don't mark `async` unless it actually `await`s; return the promise directly
- `no-array-destructuring` — use index pattern: `const { 0: base, 1: local } = arr`
- `no-opaque-abbreviations` — `charAtCursor` not `atCp`; established shorthands (`row`, `col`, `it`) are fine; `it` is allowed as the single parameter in short callbacks where the element type is clear from context: `items.forEach(it => ...)`
- `no-obvious-comments` — only comment non-obvious decisions; never restate what the code says

**use** (prefer)
- `use-bun-builtins` — prefer Bun APIs; undocumented ones are fine with `// @ts-expect-error`

## Key files

- Keep `src/index.ts` and `src/nodes/*` minimal — push plumbing into `src/utils/`.

- `src/state.ts` — single source of truth for types and the Annotation.
- `src/graph.ts` — StateGraph wiring; exports the compiled `graph`.
- `src/nodes/<name>/` — one directory per node (snake_case); `index.ts` exports the node, `prompt.ts` holds the system prompt. Each node returns `Partial<TechDesignState>`.
- `src/config/model.ts` — DIAL/Gemini client.
- `src/utils/io.ts` — console I/O helpers.
- `src/utils/llm.ts` — LLM streaming/output helpers.
