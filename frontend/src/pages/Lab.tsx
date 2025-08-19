import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type LabData = { key: string; title: string; prompt: string };

export default function Lab() {
    const { id } = useParams(); // lab key, e.g., "codebreaker-1"
    const nav = useNavigate();
    const [lab, setLab] = useState<LabData | null>(null);
    const [answer, setAnswer] = useState("");
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<null | boolean>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) nav("/");
            else loadLab();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function authHeader() {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    }

    async function loadLab() {
        try {
            setErr(null);
            const headers = await authHeader();
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/labs/${id}`, { headers });
            if (!res.ok) throw new Error(`Failed to fetch lab: ${res.status}`);
            const data = await res.json();
            setLab(data);
        } catch (e: any) {
            setErr(e.message ?? "Failed to load lab");
        }
    }

    async function submitAnswer(e: React.FormEvent) {
        e.preventDefault();
        if (!answer.trim()) return;
        try {
            setBusy(true);
            setErr(null);
            setResult(null);
            const headers = await authHeader();
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/submissions`, {
                method: "POST",
                headers,
                body: JSON.stringify({ key: id, answer }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || `Submit failed: ${res.status}`);
            setResult(Boolean(data.correct));
        } catch (e: any) {
            setErr(e.message ?? "Submission failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {!lab ? (
                <div>
                    <div className="h-8 w-64 bg-white/10 rounded-xl mb-4 animate-pulse" />
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                </div>
            ) : (
                <>
                    <button onClick={() => nav("/dashboard")} className="text-sm opacity-80 hover:opacity-100">
                        ← Back to dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-cyan-400">{lab.title}</h1>
                    <div className="rounded-2xl border border-white/10 p-5 bg-white/5">
                        <p className="whitespace-pre-wrap">{lab.prompt}</p>
                    </div>

                    <form onSubmit={submitAnswer} className="space-y-3">
                        <label className="block">
                            <span className="text-sm">Your answer</span>
                            <input
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none"
                                placeholder="Type your solution…"
                            />
                        </label>
                        {err && <p className="text-red-400 text-sm">{err}</p>}
                        {result !== null && (
                            <p className={`text-sm ${result ? "text-emerald-400" : "text-red-400"}`}>
                                {result ? "Correct! ✅" : "Not quite—try again."}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={busy}
                            className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-semibold disabled:opacity-70"
                        >
                            {busy ? "Checking…" : "Submit"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
