import chalk from "chalk";
import * as readline from "readline";
import { run } from "./src/app";
import { printEmptyLine, printPortfolio, printWelcome } from "./src/utils/io";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// console.log(`
// ---
// WELCOME TO THE AI USE CASE PORTFOLIO EXPLORER
// ---
// I translate your request into a structured portfolio of strategic AI use cases—organized by business value, implementation feasibility, and relevance to the industry and functional domain.
//
// HOW IT WORKS:
// 1.  You describe your TASK, INDUSTRY, and OBJECTIVE.
// 2.  My INTERPRETATION AGENT translates your request into structured search parameters (industry, functional area, goals, etc.).
// 3.  The CONTEXT EXPANSION AGENT adds crucial industry information (KPIs, typical processes, risks).
// 4.  The USE CASE GENERATION AGENT creates a detailed list using all collected data.
// 5.  The PORTFOLIO ORCHESTRATOR AGENT refines and formats the final list to perfectly match your initial prompt.
//
// ---
// ### EXAMPLE QUERIES:
//
// * Find use cases in the BANKING SECTOR for improving the EFFICIENCY of credit analysts.
// * Show me how AI models are being used in the GREEN ENERGY sector for WORKFLOW OPTIMIZATION and mitigating OPERATIONAL RISKS.
// * Generate examples of COMPUTER VISION application in MANUFACTURING with a focus on QUALITY CONTROL and PREDICTIVE MAINTENANCE.
// * I need use cases for SALES AUTOMATION in E-COMMERCE, specifically relating to PERSONALIZATION and RECOMMENDATION SYSTEMS.
// ---
// `);

printWelcome();

rl.question("User: ", async (input) => {
  printEmptyLine();

  const result = await run(input.trim());

  printPortfolio(result);

  rl.close();
});
