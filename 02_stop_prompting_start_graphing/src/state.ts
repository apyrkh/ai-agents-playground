import { Annotation } from "@langchain/langgraph";

export enum Phase {
  INTAKE = "INTAKE",
  CLARIFYING = "CLARIFYING",
  STACK_PROPOSAL = "STACK_PROPOSAL",
}

export interface AuditEntry {
  node: string;
  timestamp: string;
  decision: string;
}

export interface Requirements {
  features: string[];
  constraints: string[];
  nfrs: string[];
  assumptions: string[];
}

export interface Question {
  id: string;
  text: string;
  status: "open" | "answered";
  answer: string | null;
}

export const TechDesignAnnotation = Annotation.Root({
  phase: Annotation<Phase>({
    value: (_, next) => next,
    default: () => Phase.INTAKE,
  }),

  auditLog: Annotation<AuditEntry[]>({
    reducer: (prev, next) => prev.concat(next),
    default: () => [],
  }),

  rawRequirements: Annotation<string>({
    value: (_, next) => next,
    default: () => "",
  }),

  requirements: Annotation<Requirements>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({
      features: [],
      constraints: [],
      nfrs: [],
      assumptions: [],
    }),
  }),

  questions: Annotation<Question[]>({
    reducer: (prev, next) => {
      const map = new Map(prev.map(it => [it.id, it]));
      next.forEach(it => map.set(it.id, it));
      return [...map.values()];
    },
    default: () => [],
  }),
});

export type TechDesignState = typeof TechDesignAnnotation.State;
