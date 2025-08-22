import { useState } from "react";
import { submitAnswer } from "../api";
import type { SubmissionPayload, SubmissionResult } from "../model";

export function useSubmitAnswer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function run(payload: SubmissionPayload): Promise<SubmissionResult | null> {
        try {
            setLoading(true);
            setError(null);
            return await submitAnswer(payload);
        } catch (e: any) {
            setError(e.message?? "Submission failed");
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { run, loading, error };
}