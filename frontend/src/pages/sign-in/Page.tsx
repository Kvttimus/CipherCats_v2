import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { routes } from "@/app/paths";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Mode = "signin" | "signup";

export default function AuthPage() {
    const [mode, setMode] = useState<Mode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
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

                // Basic client-side validation
                if (password.length < passwordMinLength) {
                    setError(`Password must be at least ${passwordMinLength} characters long.`);
                    return;
                }

                const { error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    setError(error.message);
                } 
                // else {
                //     setInfo("Account created! Please check your email to verify your account.");
                // }
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

    async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}${routes.RESET_PASSWORD}`
            }); 

            if (error) {
                setError(error.message);
            } else {
                setInfo("Password reset email sent! Check your inbox.");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto p-6 space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                            {forgotPasswordMode ? "Reset Password" : isSignup ? "Create Your Account" : "Sign in"}
                        </CardTitle>
                        <button
                            type="button"
                            className="text-sm text-cyan-600 hover:underline disabled:opacity-50"
                            onClick={() => setMode(isSignup ? "signin" : "signup")}
                            disabled={loading}
                        >
                            {isSignup ? "Have an account? Sign in" : "New here? Sign up"}
                        </button>
                    </div>
                </CardHeader>

                <CardContent>
                    {forgotPasswordMode ? (
                        // Forgot password form
                        <form onSubmit={handleForgotPassword} className="space-y-3">
                            <input
                                className="border rounded px-3 py-2 w-full"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="email"
                            />

                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            {info && <div className="text-green-600 text-sm">{info}</div>}

                            <button
                                className="bg-black text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? "Sending..." : "Send Reset Email"}
                            </button>

                            <button
                                type="button"
                                className="text-sm text-cyan-600 hover:underline disabled:opacity-50 w-full"
                                disabled={loading}
                                onClick={() => {
                                    setForgotPasswordMode(false);
                                    setError(null);
                                    setInfo(null);
                                }}
                            >
                                Back to sign in
                            </button>
                        </form>
                    ) : (

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

                        {!isSignup && (
                            <button
                                type="button"
                                className="text-sm text-cyan-600 hover:underline disabled:opacity-50 w-full"
                                disabled={loading}
                                onClick={() => {
                                    setForgotPasswordMode(true);
                                    setError(null);
                                    setInfo(null);
                                    console.log("Forgot password clicked");
                                }}
                            >
                                Forgot your password?
                            </button>
                        )}
                    </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}