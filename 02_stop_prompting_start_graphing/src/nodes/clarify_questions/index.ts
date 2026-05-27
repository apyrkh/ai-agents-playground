import { Command, interrupt, type CompiledStateGraph, type LangGraphRunnableConfig, type StateSnapshot } from "@langchain/langgraph";
import { Phase, TechDesignAnnotation, type AuditEntry, type Question, type TechDesignState } from "../../state.ts";
import { printNodeTitle, readAnswers } from "../../utils/io.ts";

export const CLARIFY_QUESTIONS_NODE = "clarifyQuestions";

export const clarifyQuestions = async (
  state: TechDesignState,
): Promise<Partial<TechDesignState>> => {
  const openQs = state.questions.filter((q) => q.status === "open");
  if (openQs.length === 0) return {};

  // Pauses the graph; src/index.ts collects answers and resumes via Command({ resume: answers })
  const answers = interrupt<string[], string[]>(openQs.map((q) => q.text));

  const updatedQuestions: Question[] = state.questions.map((it) => {
    const idx = openQs.findIndex((oq) => oq.id === it.id);
    if (idx === -1 || it.status === "answered") return it;

    return { ...it, status: "answered", answer: answers[idx] ?? "" };
  });

  const audit: AuditEntry = {
    node: CLARIFY_QUESTIONS_NODE,
    timestamp: new Date().toISOString(),
    decision: `Successfully collected answers for ${openQs.length} questions.`,
  };

  return {
    questions: updatedQuestions,
    phase: Phase.STACK_PROPOSAL,
    auditLog: [audit],
  };
};

export const handleClarifyQuestions = async (
  snapshot: StateSnapshot,
  graph: CompiledStateGraph<TechDesignState, typeof TechDesignAnnotation.Update, string>,
  config: LangGraphRunnableConfig,
) => {
  const currentTask = snapshot.tasks.find(t => t.name === CLARIFY_QUESTIONS_NODE);

  const questions = currentTask?.interrupts[0]?.value as string[];
  if (!questions) return snapshot;

  printNodeTitle("Awaiting User Clarification");

  const questionObjs: Question[] = questions.map((text, i) => ({
    id: `q${i + 1}`,
    text,
    status: "open",
    answer: null,
  }));

  const answers = await readAnswers(questionObjs);

  await graph.invoke(new Command({ resume: answers }), config);
  return await graph.getState(config);
}
