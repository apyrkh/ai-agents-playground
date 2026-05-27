import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { model } from "../../config/model.ts";
import { Phase, type AuditEntry, type Question, type Requirements, type TechDesignState } from "../../state.ts";
import { printNodeTitle, printOpenQuestions, printRequirements } from "../../utils/io.ts";
import { parseJsonResponse, streamWithThoughts } from "../../utils/llm.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";

const LLMOutputSchema = z.object({
  features: z.array(z.string()).max(5),
  constraints: z.array(z.string()).max(3),
  nfrs: z.array(z.string()).max(3),
  assumptions: z.array(z.string()).max(4),
  questions: z.array(z.string()).max(3),
});

export const EXTRACT_REQUIREMENTS_NODE = "extractRequirements";

export const extractRequirements = async (
  state: TechDesignState,
): Promise<Partial<TechDesignState>> => {
  printNodeTitle("Analyzing & Structuring Requirements");

  const raw = await streamWithThoughts(model, [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(state.rawRequirements),
  ]);
  const parsed = parseJsonResponse(raw, LLMOutputSchema);

  const requirements: Requirements = {
    features: parsed.features,
    constraints: parsed.constraints,
    nfrs: parsed.nfrs,
    assumptions: parsed.assumptions,
  };
  printRequirements(requirements);

  const questions: Question[] = parsed.questions.map((text, i) => ({
    id: `q${i + 1}`,
    text,
    status: "open",
    answer: null,
  }));

  if (questions.length > 0) {
    printOpenQuestions(questions);
  }

  const audit: AuditEntry = {
    node: EXTRACT_REQUIREMENTS_NODE,
    timestamp: new Date().toISOString(),
    decision: `Extracted ${requirements.features.length} features, ${requirements.constraints.length} constraints, ${requirements.nfrs.length} nfrs, ${requirements.assumptions.length} assumptions, ${questions.length} blocking question(s)`,
  };

  return {
    auditLog: [audit],
    requirements,
    questions,
    phase: questions.length > 0 ? Phase.CLARIFYING : Phase.STACK_PROPOSAL,
  };
};
