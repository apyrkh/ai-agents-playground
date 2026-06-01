import { AIMessage, HumanMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages";
import { z } from "zod";
import { model } from "../../config/model.ts";
import { Phase, STACK_CATEGORIES, type AuditEntry, type Question, type Requirements, type StackChoice, type TechDesignState } from "../../state.ts";
import { createNodeSpinner, printProposedStack } from "../../utils/io.ts";
import { parseJsonResponse, streamText } from "../../utils/llm.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";

const LLMOutputSchema = z.object({
  stack: z.array(
    z.object({
      category: z.enum(STACK_CATEGORIES),
      selected: z.string(),
      version: z.string().nullable(),
      rationale: z.string(),
      alternatives: z.array(z.object({ name: z.string(), rejectedBecause: z.string() })),
    }),
  ),
});

export const PROPOSE_STACK_NODE = "proposeStack";

export const proposeStack = async (
  state: TechDesignState,
): Promise<Partial<TechDesignState>> => {
  const isRevision = state.approval.status === "rejected";
  const attempt = isRevision ? (state.revisionCount[PROPOSE_STACK_NODE] ?? 0) + 1 : 0;

  const spinner = createNodeSpinner();
  spinner.start(isRevision ? `Revising Tech Stack (attempt ${attempt})` : "Proposing Tech Stack");

  const messages: BaseMessage[] = [...state.proposalMessages];
  if (messages.length === 0) {
    messages.push(
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(
        `${formatRequirements(state.requirements)}\n\n${formatAnsweredQuestions(state.questions)}`
      ),
    );
  }

  if (messages.length > 0 && isRevision) {
    const feedback = state.approval.feedback ?? "(no reason given)";
    messages.push(
      new HumanMessage(`User rejected the previous proposal. Feedback: ${feedback}. Please revise the stack and return JSON in the same shape.`)
    );
  }

  try {
    const raw = await streamText(model, messages);
    const parsed = parseJsonResponse(raw, LLMOutputSchema);

    spinner.stop(isRevision ? `Revising Tech Stack (attempt ${attempt})` : "Proposing Tech Stack");

    const stack: StackChoice[] = parsed.stack;
    printProposedStack(stack);

    messages.push(new AIMessage(raw));

    const audit: AuditEntry = {
      node: PROPOSE_STACK_NODE,
      timestamp: new Date().toISOString(),
      decision: `Proposed stack with ${stack.length} choice(s): ${stack.map((it) => it.category).join(", ") || "none"}`,
    };

    return {
      auditLog: [audit],
      proposalMessages: messages,
      proposedStack: stack,
      phase: Phase.AWAITING_APPROVAL,
      ...(isRevision && {
        revisionCount: {
          ...state.revisionCount,
          [PROPOSE_STACK_NODE]: attempt
        }
      }),
    };

  } catch (error) {
    spinner.error("Failed to generate tech stack");
    console.error(`[${PROPOSE_STACK_NODE}] Error during tech stack generation:`, error);
    throw error;
  }
};

const formatRequirements = (req: Requirements): string => {
  const block = (label: string, items: string[]): string =>
    items.length === 0
      ? `${label}: (none)`
      : `${label}:\n${items.map((it) => `  - ${it}`).join("\n")}`;

  return [
    block("Features", req.features),
    block("Constraints", req.constraints),
    block("NFRs", req.nfrs),
    block("Assumptions", req.assumptions),
  ].join("\n\n");
};

const formatAnsweredQuestions = (questions: Question[]): string => {
  const answered = questions.filter((it) => it.status === "answered");
  if (answered.length === 0) return "Clarifications: (none)";

  const body = answered
    .map((it) => `  Q: ${it.text}\n  A: ${it.answer ?? ""}`)
    .join("\n\n");
  return `Clarifications:\n${body}`;
};
