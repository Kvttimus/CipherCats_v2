// Keep feature types next to the feature so refactors are local

export type Lab = { id: number; key: string; title: string; prompt: string };
export type SubmissionPayload = { key: string; answer: string };
export type SubmissionResult = { correct: boolean; attempts: number };