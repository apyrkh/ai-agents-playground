import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../config/model";
import { StateType } from "../graph/state";
import { ExpandedContextSchema } from "../schemas/expanded_context";
import { logAgent } from "../utils/log";

export async function contextExpansionAgent(state: StateType) {
  const base = state.businessContext;
  if (!base) {
    logAgent("Context Expansion: no base context — skipping.");
    return {};
  }

  logAgent("Context Expansion Agent working...");

  const systemMessage = new SystemMessage(`
You are a Context Expansion Agent specialized in detailing and enriching high-level business analysis.
Your task is to take the structured Business Context JSON provided by the previous agent and use your general business domain knowledge to expand it into concrete and detailed parameters, strictly conforming to the ExpandedContextSchema.

**Generation Rules (Based on the Functional Area, Strategic Goals, and Constraints):**
1.  **key_processes:** List 4-6 critical, standard steps within the identified functional area (e.g., the 'Procure-to-Pay' steps or 'Recruitment Cycle' steps).
2.  **pain_points:** List 3-5 common, yet critical, operational and financial problems that companies typically face in this domain, which align with the user's strategic goals.
3.  **target_kpis:** List 3-5 standard industry metrics (KPIs) used to measure the success and efficiency of operations in this functional area.
4.  **risk_areas:** Identify 3-5 major risks (operational, compliance, financial, or security) inherent to this functional area, paying special attention to the user's constraints.
5.  **data_landscape:** Describe 3-4 typical data types and formats (e.g., 'Unstructured email text', 'Scanned documents', 'Structured database records') involved in these processes.
6.  **standard_workflows:** Describe 3-4 common workflow logic patterns (e.g., 'Multi-level Sequential Approval', 'Rule-based Triage', 'Parallel Review').
7.  **required_integrations:** List 2-4 common enterprise systems (ERP, CRM, specialized tools) typically necessary for a solution in this context. Give priority to systems implied by the user's constraints.
`);

  const userMessage = new HumanMessage(
    "Expand the context based on the provided data: " +
    state.businessContext
  );

  try {
    const llm = model.withStructuredOutput(ExpandedContextSchema);
    const result = await llm.invoke([systemMessage, userMessage]);

    return { expandedContext: result };
  } catch (err) {
    console.error("Context Expansion Error:", err);
    return {};
  }
}
