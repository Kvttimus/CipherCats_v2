import { api } from "@/lib/http";
import type { Lab, LabSummary, SubmissionPayload, SubmissionResult } from "./model";

export function getLab(key: string) {
    return api<Lab>(`/labs/${encodeURIComponent(key)}`);
}

export function listLabs() {
    return api<LabSummary[]>("/labs");
}

export function submitAnswer(payload: SubmissionPayload) {
    return api<SubmissionResult>("/submissions", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}