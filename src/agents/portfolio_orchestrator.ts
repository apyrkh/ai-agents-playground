import { StateType } from "../graph/state";
import { UseCase } from "../schemas/use_cases";

export async function portfolioOrchestrator(state: StateType) {
  const useCases = state.useCases;
  if (!useCases || !Array.isArray(useCases)) {
    console.log("Portfolio Orchestrator: no use cases — skipping.");
    return {};
  }

  console.log("Portfolio Orchestrator Agent working...");

  const quickWin: UseCase[] = [];
  const strategicBet: UseCase[] = [];

  for (const uc of useCases) {
    const bv = uc.business_value;
    const cx = uc.complexity;
    const ttv = uc.time_to_value;

    const isQuick =
      (cx === "low" || cx === "medium") &&
      (bv === "medium" || bv === "high") &&
      (ttv === "short" || ttv === "medium");

    isQuick ? quickWin.push(uc) : strategicBet.push(uc);
  }

  return {
    portfolio: {
      strategic_bet: strategicBet,
      quick_win: quickWin
    }
  };
}
