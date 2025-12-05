import { z } from "zod";
import { UseCaseSchema } from "./use_cases";

export const PortfolioSchema = z.object({
  strategic_bet: z.array(UseCaseSchema),
  quick_win: z.array(UseCaseSchema),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;
