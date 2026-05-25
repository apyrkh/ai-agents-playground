import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../config/model";
import { StateType } from "../graph/state";
import { InputInterpreterResultSchema } from "../schemas/business_context";
import { logAgent } from "../utils/log";

export async function inputInterpreterAgent(state: StateType) {
  logAgent("Input Interpreter Agent analyzing...");

  const messages = state.messages;
  if (messages.length === 0) {
    const systemMessage = new SystemMessage(`
You are an expert Context Extractor AI, specialized in business requirements analysis.
Your sole purpose is to rigorously analyze the user's raw request and extract the specific, high-level business parameters, strictly conforming to the defined schema.

Extraction Rules:
1.  **industry:** Determine the sector (e.g., 'Finance', 'Logistics', 'E-commerce'). If the user does not specify the industry, return null.
2.  **functional_area:** Determine the specific functional domain or department (e.g., 'Human Resources (HR)', 'Supply Chain', 'Procurement'). If the user does not specify the department, return null.
3.  **strategic_goals:** Extract all explicit and implied key objectives the user wants to achieve (e.g., 'reduce operational costs', 'automate data entry').
4.  **constraints:** Extract all limitations, required integrations, or compliance necessities mentioned (e.g., 'must integrate with SAP', 'GDPR compliance required', 'limited initial budget').

If industry or functional_area is null, generate a polite question to ask the user for this specific missing information.
`);
    messages.push(systemMessage);
  }

  const userMessage = new HumanMessage(state.userInput);
  messages.push(userMessage);

  try {
    const llm = model.withStructuredOutput(InputInterpreterResultSchema);
    const result = await llm.invoke(messages);

    return {
      aiInput: result.missing_info_question,
      ...(
        result.missing_info_question
        ? { messages: new AIMessage(result.missing_info_question) }
        : {}
      ),
      businessContext: result.business_context,
    };
  } catch (err) {
    console.error("Input Interpretation Error:", err);
    return { businessContext: null };
  }
}

export const routeAfterInterpretation = (state: StateType) => {
  return state.aiInput ? "ask_user" : "context_expansion";
};

export const askUserNode = () => {
  logAgent("Ask User Agent preparing question...");
  return {};
}
