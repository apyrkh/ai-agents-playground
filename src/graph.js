import { END, START, StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const GEMINI_MODELS = {
  FLASH_LITE: "gemini-2.5-flash-lite",
  FLASH: "gemini-2.5-flash",
  PRO: "gemini-2.5-pro",
}
const model = new ChatGoogleGenerativeAI({
  model: GEMINI_MODELS.FLASH_LITE,
});

async function agentA(state) {
  const messages = [new HumanMessage(`Process: ${state.input}`)];
  const resp = await model.invoke(messages);
  const text = resp.content;

  return {
    agentAResult: text,
    output: text
  };
}

function router() {
  return { goto: "agentA" };
}

export async function buildGraph() {
  const graph = new StateGraph({
    channels: {
      input: null,
      agentAResult: null,
      output: null
    }
  });

  graph.addNode("entry", router);
  graph.addNode("agentA", agentA);

  graph.addEdge(START, "entry");
  graph.addEdge("entry", "agentA");
  graph.addEdge("agentA", END);

  return graph.compile();
}
