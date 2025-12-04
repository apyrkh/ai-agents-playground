import { z } from "zod";

export const BusinessContextSchema = z.object({
  industry: z.string(),
  functional_area: z.string(),
  strategic_goals: z.array(z.string()),
  constraints: z.array(z.string()),
});

export type BusinessContext = z.infer<typeof BusinessContextSchema>;
