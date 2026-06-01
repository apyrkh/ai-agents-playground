import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { model } from "../../config/model.ts";
import { Phase, type AuditEntry, type DesignDoc, type Question, type Requirements, type StackChoice, type TechDesignState } from "../../state.ts";
import { createNodeSpinner, printDesignDoc } from "../../utils/io.ts";
import { parseJsonResponse, streamText } from "../../utils/llm.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";

const LLMOutputSchema = z.object({
  title: z.string().min(1),
  sections: z
    .array(z.object({ title: z.string(), content: z.string() }))
    .min(1),
});

export const DESIGN_GENERATION_NODE = "designGeneration";

export const designGeneration = async (
  state: TechDesignState,
): Promise<Partial<TechDesignState>> => {
  const spinner = createNodeSpinner();
  spinner.start("Generating Tech Design");

  const humanContext = [
    formatRequirements(state.requirements),
    formatAnsweredQuestions(state.questions),
    formatStack(state.proposedStack),
  ].join("\n\n");

  const raw = await streamText(model, [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(humanContext),
  ]);
  const parsed = parseJsonResponse(raw, LLMOutputSchema);

  spinner.stop("Generating Tech Design");

  const designDoc: DesignDoc = { title: parsed.title, sections: parsed.sections };
  await printDesignDoc(designDoc);

  const audit: AuditEntry = {
    node: DESIGN_GENERATION_NODE,
    timestamp: new Date().toISOString(),
    decision: `Generated "${designDoc.title}" with ${designDoc.sections.length} section(s): ${designDoc.sections.map((it) => it.title).join(", ")}`,
  };

  return {
    auditLog: [audit],
    finalDesignDoc: designDoc,
    phase: Phase.DONE,
  };
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

const formatStack = (stack: StackChoice[]): string => {
  if (stack.length === 0) return "Approved Stack: (none)";

  const body = stack
    .map((it) => {
      const version = it.version ? ` v${it.version}` : "";
      return `  - ${it.category}: ${it.selected}${version}\n    rationale: ${it.rationale}`;
    })
    .join("\n");
  return `Approved Stack:\n${body}`;
};
