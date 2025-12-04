export async function portfolioOrchestrator(state) {
  console.log("Portfolio Orchestrator received:");
  console.log(JSON.stringify(state.businessContext, null, 2));
  return {};
}
