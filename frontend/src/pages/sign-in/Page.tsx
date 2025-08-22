import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

export default function AuthPage() {
    const [mode, setMode] = useState<Mode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isSignup = mode === "signup";
    const passwordMinLength = 8;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setLoading(true);

        try {
            if (isSignup) {
                if (password !== confirm) {
                    setError("Passwords do not match.");
                    return;
                }
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) setError(error.message);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) setError(error.message);
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                    {isSignup ? "Create Your Account" : "Sign in"}
                </h1>
                <button
                    type="button"
                    className="text-sm text-cyan-600 hover:underline disabled:opacity-50"
                    onClick={() => setMode(isSignup ? "signin" : "signup")}
                    disabled={loading}
                >
                    {isSignup ? "Have an account? Sign in" : "New here? Sign up"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    className="border rounded px-3 py-2 w-full"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                />

                <input
                    className="border rounded px-3 py-2 w-full"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    minLength={passwordMinLength}
                />

                {isSignup && (
                    <input
                        className="border rounded px-3 py-2 w-full"
                        type="password"
                        placeholder="Confirm password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                        minLength={passwordMinLength}
                    />
                )}

                {error && <div className="text-red-600 text-sm">{error}</div>}
                {info && <div className="text-green-600 text-sm">{info}</div>}

                <button
                    className="bg-black text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
                    disabled={loading}
                    type="submit"
                >
                    {loading
                        ? isSignup
                            ? "Creating account..."
                            : "Signing in..."
                        : isSignup
                            ? "Create account"
                            : "Continue"}
                </button>
            </form>
        </div>
    );
}