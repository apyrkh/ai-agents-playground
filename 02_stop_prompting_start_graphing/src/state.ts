import type { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export enum Phase {
  INTAKE = "INTAKE",
  CLARIFYING = "CLARIFYING",
  STACK_PROPOSAL = "STACK_PROPOSAL",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  STACK_REVISION = "STACK_REVISION",
  DESIGN_GENERATION = "DESIGN_GENERATION",
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

export const STACK_CATEGORIES = [
  "frontend",
  "backend",
  "database",
  "infra",
  "auth",
  "observability",
] as const;

export type StackCategory = (typeof STACK_CATEGORIES)[number];

export interface StackChoice {
  category: StackCategory;
  selected: string;
  version: string | null;
  rationale: string;
  alternatives: { name: string; rejectedBecause: string }[];
}

export interface Approval {
  status: "pending" | "approved" | "rejected";
  feedback: string | null;
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

  proposalMessages: Annotation<BaseMessage[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),

  proposedStack: Annotation<StackChoice[]>({
    value: (_, next) => next,
    default: () => [],
  }),

  approval: Annotation<Approval>({
    value: (_, next) => next,
    default: () => ({ status: "pending", feedback: null }),
  }),

  revisionCount: Annotation<Record<string, number>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({}),
  }),
});

export type TechDesignState = typeof TechDesignAnnotation.State;
