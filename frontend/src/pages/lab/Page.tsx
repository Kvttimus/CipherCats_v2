import { useParams } from "react-router-dom";
import { useState } from "react";
import { useLab, useSubmitAnswer, LabPrompt, AnswerForm, ProgressBadge, SubmissionResult } from "@/features/labs";

export default function LabPage() {
    const { labKey } = useParams<{ labKey: string }>();
    if (!labKey) {
        return <div className="text-red-600">Invalid lab URL</div>;
    }
    const { data: lab, loading, error } = useLab(labKey || "");
    const { run: submitAnswer, loading: submitting, error: submitError } = useSubmitAnswer();
    const [result, setResult] = useState<SubmissionResult | null>(null);
    
    const handleSubmit = async (answer: string)=> {
        if (!lab) return;
        const result = await submitAnswer({ key: lab.key, answer });
        if (result) setResult(result);
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return lab ? (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <LabPrompt lab={lab} />
            <AnswerForm onSubmit={handleSubmit} disabled={submitting} />
            {submitError && <div className="text-red-600">{submitError}</div>}
            {result && <ProgressBadge correct={result.correct} />}
        </div>
    ) : null;
}