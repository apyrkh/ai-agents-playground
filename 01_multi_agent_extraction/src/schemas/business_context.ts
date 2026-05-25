import { z } from "zod";

export const BusinessContextSchema = z.object({
  industry: z.string().nullable(),
  functional_area: z.string().nullable(),
  strategic_goals: z.array(z.string()),
  constraints: z.array(z.string()),
});

export const InputInterpreterResultSchema = z.object({
  business_context: BusinessContextSchema,
  missing_info_question: z.string().nullable(),
});

export type BusinessContext = z.infer<typeof BusinessContextSchema>;
