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
You are an AI Use Case Generator for enterprise environments.

Your task: produce 4–6 concrete, realistic AI use cases.

Inputs:
- businessContext: { industry, functional_area, strategic_goals, constraints }
- expandedContext: { key_processes, pain_points, target_kpis, risk_areas, data_landscape, standard_workflows, integrations }

Rules:
1. Use cases must align with:
   • the industry,
   • the functional area,
   • the strategic goals,
   • the constraints.
2. Each use case must contain:
   - title (short, specific)
   - description (2–3 sentences)
   - problem_addressed
   - required_inputs (subset of data_landscape)
   - workflow_fit (from standard_workflows)
   - expected_kpi_impact
   - risks_or_limitations
   - enterprise_integrations (subset of integrations)
   - business_value: low | medium | high
   - complexity: low | medium | high
   - time_to_value: short | medium | long
3. Keep logic enterprise-grade: no niche systems, tie each use case to strategic goals.
4. Be specific and actionable; avoid generic AI statements.
`);

  const userMessage = new HumanMessage(
    "Generate the use cases based on the full context:\n" +
    JSON.stringify({
      businessContext: state.businessContext,
      expandedContext: state.expandedContext
    })
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
