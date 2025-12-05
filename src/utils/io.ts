import chalk from "chalk";
import { StateType } from "../graph/state";

const section = chalk.bold;
const bullet = chalk.dim("• ");

export const printEmptyLine = () => console.log();

const padding = " ".repeat(3);

export const logInfo = (message: string) => {
  console.log(chalk.blue(`Info: ${message}`));
}
export const logWarning = (message: string) => {
  console.warn(chalk.yellow(`Warning: ${message}`));
}
export const logError = (message: string) => {
  console.error(chalk.dim.red(`Error: ${message}`));
}

const printDisclaimer = () => {
  console.warn(
    `${padding}${chalk.dim.italic.red("This is a demo version. Results may vary and are not guaranteed to be accurate.\n")}`
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
  console.log(`${padding}> ${chalk.bold(text)}`);
}

const printLine = (text: string) => {
  console.log(`${padding}${text}`);
}

export const printWelcome = () => {

  printHeader("Welcome to the AI Use Case Portfolio Explorer");
  printDisclaimer();
  printSection("I translate your request into a structured portfolio of AI use cases — prioritized by business value, feasibility, and domain relevance.\n");

  printSection("How it works:");
  printLine(`${chalk.dim("1.")} You describe your task, industry, and objective.`);
  printLine(`${chalk.dim("2.")} The interpretation agent extracts structured parameters.`);
  printLine(`${chalk.dim("3.")} The context expansion agent adds KPIs, workflows, and risks.`);
  printLine(`${chalk.dim("4.")} The use case generation agent proposes relevant ideas.`);
  printLine(`${chalk.dim("5.")} The portfolio orchestrator organizes everything into a clean list.`);

  printEmptyLine();

  printLine(chalk.gray("Example queries:"));
  printLine(chalk.gray("* Banking: improving efficiency of credit analysts."));
  printLine(chalk.gray("* Green energy: workflow optimization and mitigating operational risks."));
  printLine(chalk.gray("* Manufacturing: computer vision for quality control and predictive maintenance."));
  printLine(chalk.gray("* E-commerce: sales automation with personalization and recommendations."));

  printEmptyLine();
}

export function printPortfolio(state: StateType) {
  const { businessContext, portfolio } = state;
  if (!businessContext || !portfolio) {
    logError("Incomplete state. Business context or portfolio is missing.");
    return;
  }

  const quick = portfolio.quick_win;
  const strategic = portfolio.strategic_bet;
  const total = quick.length + strategic.length;

  printHeader("Your AI Use-Case Portfolio Is Ready");

  console.log(
    section(
      `Tailored portfolio for the ${businessContext.functional_area} function in ${businessContext.industry}.\n`
    )
  );

  console.log(section("Context interpreted"));
  console.log(
    `${bullet}Industry: ${chalk.cyan(businessContext.industry)}\n` +
    `${bullet}Functionality: ${chalk.cyan(
      businessContext.functional_area
    )}\n` +
    `${bullet}Primary objectives: ${chalk.cyan(
      businessContext.strategic_goals.join(", ")
    )}\n` +
    `${bullet}Constraints: ${chalk.cyan(
      businessContext.constraints.join(", ")
    )}\n`
  );

  console.log(section("Portfolio summary"));
  console.log(
    `${bullet}Total use cases: ${chalk.green(total)}\n` +
    `${bullet}Quick Wins: ${chalk.green(quick.length)}\n` +
    `${bullet}Strategic Bets: ${chalk.green(strategic.length)}\n`
  );

  printUseCases("Quick Wins", quick);
  printUseCases("Strategic Bets", strategic);

  console.log(
    chalk.dim(
      "You can now explore each use case, request detailed specs, or refine the portfolio.\n"
    )
  );
}

function printUseCases(title: string, arr: StateType["portfolio"]["quick_win"]) {
  const bullet = chalk.dim("• ");
  console.log(chalk.bold.underline(`${title} (${arr.length})`));
  if (arr.length === 0) {
    console.log(chalk.dim("  (none)\n"));
    return;
  }

  arr.forEach((uc, i) => {
    console.log(chalk.bold(`\n#${i + 1} ${uc.title}`));
    console.log(chalk.italic(uc.description));
    console.log(
      `${bullet}Problem: ${chalk.cyan(uc.problem_addressed.join(", "))}`
    );
    console.log(
      `${bullet}Inputs: ${chalk.cyan(uc.required_inputs.join(", "))}`
    );
    console.log(
      `${bullet}Workflow fit: ${chalk.cyan(uc.workflow_fit.join(", "))}`
    );
    console.log(
      `${bullet}Expected KPI: ${chalk.cyan(
        uc.expected_kpi_impact.join(", ")
      )}`
    );
    console.log(
      `${bullet}Risks: ${chalk.cyan(uc.risks_or_limitations.join(", "))}`
    );
    console.log(
      `${bullet}Integrations: ${chalk.cyan(
        uc.enterprise_integrations.join(", ")
      )}`
    );
    console.log(
      `${bullet}Business value: ${colorLevel(uc.business_value)} | Complexity: ${colorLevel(
        uc.complexity
      )} | Time: ${colorLevel(uc.time_to_value)}\n`
    );
  });
}

function colorLevel(v: string) {
  if (v === "high") return chalk.green(v);
  if (v === "medium") return chalk.yellow(v);
  return chalk.red(v);
}
