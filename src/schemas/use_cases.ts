import { z } from "zod";

export const UseCaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  problem_addressed: z.array(z.string()),
  required_inputs: z.array(z.string()),
  workflow_fit: z.array(z.string()),
  expected_kpi_impact: z.array(z.string()),
  risks_or_limitations: z.array(z.string()),
  enterprise_integrations: z.array(z.string()),
  business_value: z.enum(["low", "medium", "high"]),
  complexity: z.enum(["low", "medium", "high"]),
  time_to_value: z.enum(["short", "medium", "long"]),
});

export const UseCaseListSchema = z.object({
  use_cases: z.array(UseCaseSchema),
});

export type UseCase = z.infer<typeof UseCaseSchema>;
export type UseCaseList = z.infer<typeof UseCaseListSchema>["use_cases"];
