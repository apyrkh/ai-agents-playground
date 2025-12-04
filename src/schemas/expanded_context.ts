import { z } from "zod";

export const ExpandedContextSchema = z.object({
  key_processes: z.array(z.string()),
  pain_points: z.array(z.string()),
  target_kpis: z.array(z.string()),
  risk_areas: z.array(z.string()),
  data_landscape: z.array(z.string()),
  standard_workflows: z.array(z.string()),
  integrations: z.array(z.string()),
});

export type ExpandedContext = z.infer<typeof ExpandedContextSchema>;
