import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase"

export default function Login() {
    const nav = useNavigate();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
            if (mode === "signin") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            }
            nav("/dashboard");
        } catch (e: any) {
            setErr(e.message ?? "Authentication failed");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen grid place-items-center">
            <div className="w-full max-w-md rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur">
                <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center">CipherCats</h1>
                <div className="flex gap-2 mb-6">
                    <button
                        className={`flex-1 py-2 rounded-xl ${mode === "signin" ? "bg-cyan-500 text-black" : "bg-white/10"}`}
                        onClick={() => setMode("signin")}
                    >
                        Sign in
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-xl ${mode === "signup" ? "bg-cyan-500 text-black" : "bg-white/10"}`}
                        onClick={() => setMode("signup")}
                    >
                        Sign up
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-sm">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none"
                            required
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none"
                            required
                        />
                    </label>
                    {err && <p className="text-red-400 text-sm">{err}</p>}
                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full py-2 rounded-xl bg-cyan-400 text-black font-semibold disabled:opacity-70"
                    >
                        {busy ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
