export async function portfolioOrchestrator(state) {
  console.log("Portfolio Orchestration Agent working...");

  console.log();
  console.log("----- Current State -----");
  console.log();
  console.log("User Raw Input:", state.rawInput);
  console.log();
  console.log("Business Context:", JSON.stringify(state.businessContext, null, 2));
  console.log();
  console.log("Expanded Context:", JSON.stringify(state.expandedContext, null, 2));

  return {};
}
