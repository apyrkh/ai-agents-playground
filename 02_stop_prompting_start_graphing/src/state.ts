import { Annotation } from "@langchain/langgraph";

export enum Phase {
  INTAKE = "INTAKE",
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
});

export type TechDesignState = typeof TechDesignAnnotation.State;
