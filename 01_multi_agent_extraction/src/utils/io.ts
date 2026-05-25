import chalk from "chalk";
import { StateType } from "../graph/state";

const indent = 2;
const padding = " ".repeat(indent);
const bullet = chalk.dim("• ");

const printDisclaimer = () => {
  console.warn(
    `${padding}${chalk.dim.italic.red("*This is a demo version. Results may vary and are not guaranteed to be accurate.")}`
  );
}

const printHeader = (text: string) => {
  const paddedText = ` ${text} `;

  console.log(
    `\n${padding}${"=".repeat(paddedText.length)}` +
    `\n${padding}${chalk.bold(paddedText)}` +
    `\n${padding}${"=".repeat(paddedText.length)}` +
    "\n"
  );
}

const printSection = (text: string) => {
  console.log(`${padding}# ${chalk.bold(text)}`);
}

const printLine = (text: string) => {
  console.log(`${padding}${text}`);
}

const printBulletLine = (text: string) => {
  console.log(`${padding}${bullet}${text}`);
};

export const printEmptyLine = () => console.log();

export const printWelcome = () => {
  printHeader("Welcome to the AI Use Case Portfolio Explorer");
  printDisclaimer();

  printEmptyLine();

  printSection("This tool turns your request into a structured portfolio of AI use cases, prioritized by business value, feasibility, and domain fit.");
  printEmptyLine();

  printSection("How it works:");
  printLine(`${chalk.dim("1.")} You provide the task, industry, and objective.`);
  printLine(`${chalk.dim("2.")} The interpretation agent extracts key parameters.`);
  printLine(`${chalk.dim("3.")} The context agent expands KPIs, workflows, and risks.`);
  printLine(`${chalk.dim("4.")} The generation agent creates concrete use cases.`);
  printLine(`${chalk.dim("5.")} The orchestrator compiles everything into a clear portfolio.`);

  printEmptyLine();

  printLine(chalk.gray("Example queries:"));
  printLine(chalk.gray("* Banking: boost credit-risk assessment and reduce manual analyst workload."));
  printLine(chalk.gray("* Green energy: optimize turbine/solar workflows and lower operational risk."));
  printLine(chalk.gray("* Manufacturing: improve quality control and enable predictive maintenance."));
  printLine(chalk.gray("* E-commerce: automate sales funnels with personalization and smarter recommendations."));

  printEmptyLine();
}

export const printInputHint = () => {
  printLine(chalk.bold("Please enter your message:"));
}

export const inputPrompt = `${" ".repeat(indent - 2)}> `;

export const printAiMessage = (message: string) => {
  printEmptyLine();
  printLine(chalk.bold("AI Assistant:"));
  printLine(chalk.italic(message));
  printEmptyLine();
};

export const printResult = (state: StateType) => {
  const { businessContext, portfolio } = state;
  if (!businessContext || !portfolio) {
    printEmptyLine();
    printLine(chalk.red("Incomplete state. Business context or portfolio is missing."));
    printEmptyLine();
    return;
  }

  const quick = portfolio.quick_win;
  const strategic = portfolio.strategic_bet;
  const total = quick.length + strategic.length;

  printHeader("Your AI Use-Case Portfolio Is Ready");
  printDisclaimer();

  printEmptyLine();

  printSection("Context interpreted");
  printBulletLine(`Industry: ${chalk.cyan(businessContext.industry)}`);
  printBulletLine(`Functionality: ${chalk.cyan(businessContext.functional_area)}`);
  printBulletLine(`Primary objectives: ${chalk.cyan(businessContext.strategic_goals.join(", ") || "n/a")}`);
  printBulletLine(`Constraints: ${chalk.cyan(businessContext.constraints.join(", ") || "n/a")}`);

  printEmptyLine();

  printSection("Portfolio summary");
  printBulletLine(`Total use cases: ${chalk.green(total)}`);
  printBulletLine(`Quick Wins: ${chalk.green(quick.length)}`);
  printBulletLine(`Strategic Bets: ${chalk.green(strategic.length)}`);

  printEmptyLine();

  printUseCases("Quick Wins", quick);
  printUseCases("Strategic Bets", strategic);

  console.log(
    chalk.dim(
      "You can now explore each use case, request detailed specs, or refine the portfolio.\n"
    )
  );
}

const colorLevel = (v: string) => {
  if (v === "high") return chalk.green(v);
  if (v === "medium") return chalk.yellow(v);
  return chalk.red(v);
}

const printUseCases = (title: string, arr: NonNullable<StateType["portfolio"]>["quick_win"]) => {
  printSection(`${title} (${arr.length})`);
  printEmptyLine();

  if (arr.length === 0) {
    return;
  }

  arr.forEach((uc, i) => {
    printLine(chalk.bold(`#${i + 1} ${uc.title}`));
    printLine(chalk.italic(uc.description));

    printBulletLine(`Problem: ${chalk.cyan(uc.problem_addressed.join(", "))}`);
    printBulletLine(`Inputs: ${chalk.cyan(uc.required_inputs.join(", "))}`);
    printBulletLine(`Workflow fit: ${chalk.cyan(uc.workflow_fit.join(", "))}`);
    printBulletLine(`Expected KPI: ${chalk.cyan(uc.expected_kpi_impact.join(", "))}`);
    printBulletLine(`Risks: ${chalk.cyan(uc.risks_or_limitations.join(", "))}`);
    printBulletLine(`Integrations: ${chalk.cyan(uc.enterprise_integrations.join(", "))}`);

    printBulletLine(
      `Business value: ${colorLevel(uc.business_value)} | ` +
      `Complexity: ${colorLevel(uc.complexity)} | ` +
      `Time: ${colorLevel(uc.time_to_value)}`
    );
    printEmptyLine();
  });
}
