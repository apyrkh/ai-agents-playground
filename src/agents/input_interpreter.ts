import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../config/model";
import { GraphState } from "../graph/state";
import { BusinessContextSchema } from "../schemas/business_context";

export async function inputInterpreterAgent(state: typeof GraphState) {
  console.log("Input Interpreter Agent working...");

  const systemMessage = new SystemMessage(`
You are an expert Context Extractor AI, specialized in business requirements analysis.
Your sole purpose is to rigorously analyze the user's raw request and extract the specific, high-level business parameters, strictly conforming to the defined schema.

Extraction Rules:
1.  **industry:** Determine the sector (e.g., 'Finance', 'Logistics', 'E-commerce'). Use 'General Business' if the context is vague.
2.  **functional_area:** Determine the specific functional domain or department (e.g., 'Human Resources (HR)', 'Supply Chain', 'Procurement'). Use 'Operations' if the context is vague.
3.  **strategic_goals:** Extract all explicit and implied key objectives the user wants to achieve (e.g., 'reduce operational costs', 'automate data entry').
4.  **constraints:** Extract all limitations, required integrations, or compliance necessities mentioned (e.g., 'must integrate with SAP', 'GDPR compliance required', 'limited initial budget').
`);

  const userMessage = new HumanMessage(
    "User request: " +
    state.rawInput
  );

  try {
    const llm = model.withStructuredOutput(BusinessContextSchema);
    const result = await llm.invoke([systemMessage, userMessage]);

    return { businessContext: result };
  } catch (err) {
    console.error("Input Interpretation Error:", err);
    return { businessContext: null };
  }
}
