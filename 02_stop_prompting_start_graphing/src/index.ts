import { graph } from "./graph.ts";
import { printWelcome, readUserBrief } from "./utils/io.ts";
import { CLARIFY_QUESTIONS_NODE, handleClarifyQuestions } from "./nodes/clarify_questions";

printWelcome();
const rawRequirements = await readUserBrief();

const config = { configurable: { thread_id: "1" } };
await graph.invoke({ rawRequirements }, config);

let snapshot = await graph.getState(config);
if (snapshot.next.includes(CLARIFY_QUESTIONS_NODE)) {
  snapshot = await handleClarifyQuestions(snapshot, graph, config);
}

process.exit(0);
