import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type LabPreview = { key: string; title: string; prompt: string };

export default function Dashboard() {
    const nav = useNavigate();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [lab, setLab] = useState<LabPreview | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const u = data.session?.user;
            if (!u) {
                nav("/");
            } else {
                setUserEmail(u.email ?? u.id);
                loadLab("codebreaker-1");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function authHeader() {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        return { Authorization: `Bearer ${token}` };
    }

    async function loadLab(key: string) {
        try {
            setErr(null);
            const headers = await authHeader();
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/labs/${key}`, { headers });
            if (!res.ok) throw new Error(`Failed to fetch lab: ${res.status}`);
            const data = await res.json();
            setLab(data);
        } catch (e: any) {
            setErr(e.message ?? "Failed to load lab");
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
        nav("/");
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-cyan-400">Dashboard</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm opacity-80">{userEmail}</span>
                    <button onClick={signOut} className="px-3 py-1 rounded-lg bg-white/10">
                        Sign out
                    </button>
                </div>
            </header>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Your next lab</h2>
                {err && <p className="text-red-400">{err}</p>}
                {!lab ? (
                    <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
                ) : (
                    <Link
                        to={`/labs/${lab.key}`}
                        className="block rounded-2xl border border-white/10 p-5 hover:bg-white/5 transition"
                    >
                        <h3 className="text-xl font-semibold text-cyan-300">{lab.title}</h3>
                        <p className="mt-2 line-clamp-3 opacity-80">{lab.prompt}</p>
                        <div className="mt-4">
                            <span className="inline-block rounded-lg bg-cyan-500/20 text-cyan-300 px-3 py-1 text-sm">
                                Start lab
                            </span>
                        </div>
                    </Link>
                )}
            </section>
        </div>
    );
}
