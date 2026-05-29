import { Command, interrupt, type CompiledStateGraph, type LangGraphRunnableConfig, type StateSnapshot } from "@langchain/langgraph";
import { Phase, TechDesignAnnotation, type AuditEntry, type StackChoice, type TechDesignState } from "../../state.ts";
import { printNodeTitle, readApproval } from "../../utils/io.ts";

type ApprovalResult = { approved: boolean; feedback: string | null };

export const REQUEST_APPROVAL_NODE = "requestApproval";

export const requestApproval = async (
  state: TechDesignState,
): Promise<Partial<TechDesignState>> => {
  const result = interrupt<StackChoice[], ApprovalResult>(state.proposedStack);

  if (result.approved) {
    const audit: AuditEntry = {
      node: REQUEST_APPROVAL_NODE,
      timestamp: new Date().toISOString(),
      decision: "Stack approved by user.",
    };

    return {
      approval: { status: "approved", feedback: null },
      phase: Phase.DESIGN_GENERATION,
      auditLog: [audit],
    };
  }

  const audit: AuditEntry = {
    node: REQUEST_APPROVAL_NODE,
    timestamp: new Date().toISOString(),
    decision: `Stack rejected: ${result.feedback ?? "(no reason provided)"}`,
  };

  return {
    approval: { status: "rejected", feedback: result.feedback },
    phase: Phase.STACK_REVISION,
    auditLog: [audit],
  };
};

export const handleRequestApproval = async (
  snapshot: StateSnapshot,
  graph: CompiledStateGraph<TechDesignState, typeof TechDesignAnnotation.Update, string>,
  config: LangGraphRunnableConfig,
) => {
  const currentTask = snapshot.tasks.find(t => t.name === REQUEST_APPROVAL_NODE);

  const stack = currentTask?.interrupts[0]?.value as StackChoice[] | undefined;
  if (!stack) return snapshot;

  printNodeTitle("Awaiting User Approval");

  const result = await readApproval();

  await graph.invoke(new Command({ resume: result }), config);
  return await graph.getState(config);
};
