import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError("An unexpected error ocurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto p-6 space-y-3">
            <h1 className="text-xl font-semibold">Sign in</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    className="border rounded px-3 py-2 w-full"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <input
                    className="border rounded px-3 py-2 w-full"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <button
                    className="bg-black text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
                    disabled={loading}
                    type="submit"
                >
                    {loading ? "Signing in..." : "Continue"}
                </button>
            </form>
        </div>
    );
}