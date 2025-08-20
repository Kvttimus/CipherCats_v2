import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useLab, useSubmitAnswer, LabPrompt, AnswerForm, ProgressBadge } from "@/features/labs";
import type { SubmissionResult } from "@/features/labs";

export default function Dashboard() {
    const [result, setResult] = useState<SubmissionResult | null>(null);

    // const { labKey } = useParams<{ labKey: string }>();
    // const { data: lab, loading, error } = useLab(labKey!);
    const { data: lab, loading, error } = useLab("codebreaker-1"); // TEMP HARDCODING
    const { run: submitAnswer, loading: submitting, error: submitError } = useSubmitAnswer();

    const handleSubmit = async (answer: string) => {
        if (!lab) return;

        const result = await submitAnswer({ key: lab.key, answer });
        if (result) {
            setResult(result);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <button
                    className="text-sm underline hover:no-underline"
                    onClick={() => supabase.auth.signOut()}
                >
                    Sign out
                </button>
            </div>
            {loading && <div className="text-gray-600">Loading lab...</div>}
            {error && <div className="text-red-600">Error loading lab: {error}</div>}
            {lab && (
                <div className="space-y-4">
                    <LabPrompt lab={lab} />
                    <AnswerForm
                        onSubmit={handleSubmit}
                        disabled={submitting}
                    />
                    {submitError && (
                        <div className="text-red-600">Submit error: {submitError}</div>
                    )}
                    {result && <ProgressBadge correct={result.correct} />}
                </div>
            )}
        </div>
    );
}