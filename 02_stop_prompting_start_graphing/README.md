# Tech Design Architect Agent

Demonstrating a deterministic tech design workflow, live-coded node by node.

Stack:
- LangGraph
- TypeScript
- Bun.js

## Setup

```sh
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

#
cp .env.sample .env
bun install
bun run demo
```

## Target workflow

Built up one node at a time; each step is a commit, each commit is runnable end-to-end.

```
INTAKE → CLARIFYING? → STACK_PROPOSAL → AWAITING_APPROVAL → DESIGN_GENERATION → DONE
```

- Each phase transition will be recorded in an append-only audit log.
- Use LangGraph's `interrupt()` for human-in-the-loop (HITL).
- Revision loop capped at 3.
