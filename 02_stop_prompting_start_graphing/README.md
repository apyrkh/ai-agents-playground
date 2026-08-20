# Tech Design Architect Agent

A deterministic LangGraph workflow that turns a raw feature request into an approved tech design document.

- Reads your request and pulls out clear requirements: features, constraints, non-functional needs, assumptions.
- Asks you first if something is missing.
- Proposes a tech stack — frontend, backend, database, infra, auth, observability — with a reason for each pick.
- Waits for your approval; a rejection sends it back for another try, up to 3 times.
- Once approved, writes the final design doc.
- Logs every step, so you can see exactly how it got there.

## Target Workflow

Built up one node at a time; each step is a commit, each commit is runnable end-to-end.

```
INTAKE → CLARIFYING? → STACK_PROPOSAL → AWAITING_APPROVAL → DESIGN_GENERATION → DONE
```

- Each phase transition is recorded in an append-only audit log.
- Uses LangGraph's `interrupt()` for human-in-the-loop (HITL) approval.
- Revision loop capped at 3.

## 📦 How to Run the Demo

1.  Install Bun (if not installed):
    ```sh
    curl -fsSL https://bun.sh/install | bash
    ```

2.  Setup `.env`:
    ```sh
    cp .env.sample .env
    ```

3.  Install dependencies:
    `bun install`

4.  Run demo:
    `bun run demo`

## 🔑 EPAM DIAL API Key

1.  **Go to:**
    `https://ai-proxy.lab.epam.com`

2.  **Request** access to a DIAL API key from your EPAM account.

## 🔑 Gemini (Google) API Key

1.  **Go to:**
    `https://aistudio.google.com/app/apikey`

2.  **Create** a new API key.
