import { model } from "../config/model";
import { BusinessContextSchema } from "../schemas/business_context";

export async function inputInterpreterAgent(state) {
  const structured = model.withStructuredOutput(BusinessContextSchema);

  const prompt = `
    Extract:
    - industry
    - functional area
    - strategic goal (if any)
    - user constraints

    User request: "${state.rawInput}"
  `;

  try {
    const res = await structured.invoke(prompt);
    return { businessContext: res };
  } catch {
    return { businessContext: null };
  }
}
