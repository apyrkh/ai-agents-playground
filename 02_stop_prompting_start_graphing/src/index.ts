import { graph } from "./graph.ts";
import { printWelcome, readUserBrief } from "./utils/io.ts";
import { CLARIFY_QUESTIONS_NODE, handleClarifyQuestions } from "./nodes/clarify_questions";
import { REQUEST_APPROVAL_NODE, handleRequestApproval } from "./nodes/request_approval";

printWelcome();
const rawRequirements = await readUserBrief();

const config = { configurable: { thread_id: "1" } };
await graph.invoke({ rawRequirements }, config);

let snapshot = await graph.getState(config);
while (snapshot.next.length > 0) {
  if (snapshot.next.includes(CLARIFY_QUESTIONS_NODE)) {
    snapshot = await handleClarifyQuestions(snapshot, graph, config);
  } else if (snapshot.next.includes(REQUEST_APPROVAL_NODE)) {
    snapshot = await handleRequestApproval(snapshot, graph, config);
  } else {
    break;
  }
}

process.exit(0);
