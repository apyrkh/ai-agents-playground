import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../config/model";
import { StateType } from "../graph/state";
import { UseCaseGenerationResultSchema } from "../schemas/use_cases";
import { logAgent } from "../utils/log";

export async function useCaseGenerationAgent(state: StateType) {
  if (!state.expandedContext) {
    logAgent("Use Case Generation: no expanded context — skipping.");
    return {};
  }

  logAgent("Use Case Generation Agent working...");

  const systemMessage = new SystemMessage(`
You are an AI Use Case Generator.
Your task: generate a set of concrete, realistic, enterprise-grade AI use cases.

Input: Expanded business context (functional area, pain points, KPIs, workflows, key processes, risk areas, data landscape, constraints).

Generation Rules:
1. Produce 4–6 use cases.
2. Each use case must include:
   - **title**: short, specific.
   - **description**: 2–3 sentences describing how AI solves a problem.
   - **problem_addressed**: which pain point(s) it resolves.
   - **required_inputs**: list of data needed (from data_landscape).
   - **workflow_fit**: which standard workflow patterns align with this use case.
   - **expected_kpi_impact**: which KPIs should improve and why.
   - **risks_or_limitations**: short realistic list.
   - **enterprise_integrations**: which integrations matter.
   - **business_value**: one of (low | medium | high).
   - **complexity**: one of (low | medium | high).
   - **time_to_value**: one of (short | medium | long).

3. Use real enterprise logic.  
4. Do NOT invent niche systems; stay within typical enterprise patterns.  
5. Always tie back to strategic goals.  
`);

  const userMessage = new HumanMessage(
    "Generate the use cases from expanded context: " +
    JSON.stringify(state.expandedContext)
  );

  try {
    const llm = model.withStructuredOutput(UseCaseGenerationResultSchema);
    const result = await llm.invoke([systemMessage, userMessage]);

    return { useCases: result.use_cases };
  } catch (err) {
    console.error("Use Case Generation Error:", err);
    return {};
  }
}
