import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { model } from "../../config/model.ts";
import type { AuditEntry, Requirements, TechDesignState } from "../../state.ts";
import { printNodeTitle, printRequirements } from "../../utils/io.ts";
import { parseJsonResponse, streamWithThoughts } from "../../utils/llm.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";

const LLMOutputSchema = z.object({
  features: z.array(z.string()).max(5),
  constraints: z.array(z.string()).max(3),
  nfrs: z.array(z.string()).max(3),
  assumptions: z.array(z.string()).max(4),
  questions: z.array(z.string()).max(3).default([]),
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

  const audit: AuditEntry = {
    node: EXTRACT_REQUIREMENTS_NODE,
    timestamp: new Date().toISOString(),
    decision: `Extracted ${requirements.features.length} features, ${requirements.constraints.length} constraints, ${requirements.nfrs.length} nfrs, ${requirements.assumptions.length} assumptions`,
  };

  return {
    auditLog: [audit],
    requirements,
  };
};
