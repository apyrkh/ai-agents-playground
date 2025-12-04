import { z } from "zod";

export const BusinessContextSchema = z.object({
  industry: z.string(),
  functional_area: z.string(),
  strategic_goal: z.string().optional(),
  user_constraints: z.array(z.string()).optional(),
});

export type BusinessContext = z.infer<typeof BusinessContextSchema>;
