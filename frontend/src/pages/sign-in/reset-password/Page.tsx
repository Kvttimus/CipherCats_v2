import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { routes } from "@/app/paths";
import { useAuth } from "@/context/AuthContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { signOut } = useAuth();

    const passwordMinLength = 8;

    // Handle the reset tokens from URL
    useEffect(() => {
        const handleAuthRedirect = async () => {
            try {
                // First check if user already has a valid session
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    console.log('User already authenticated');
                    return; // User is ready to reset password
                }

                // Check hash parameters
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                const errorParam = hashParams.get('error');
                const errorDescription = hashParams.get('error_description');

                // Handle errors from URL
                if (errorParam) {
                    setError(`Reset failed: ${errorDescription || errorParam}`);
                    return;
                }

                // Try to set session with tokens
                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });

                    if (error) {
                        console.error('Session error:', error);
                        setError("Reset link expired or invalid. Please request a new one.");
                    }
                } else {
                    // User came directly to page - provide helpful message
                    setError("Please use the reset link from your email to access this page.");
                }
            } catch (err) {
                console.error('Auth redirect error:', err);
                setError("An error occurred processing your reset link.");
            }
        };

        handleAuthRedirect();
    }, []);

    async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
        // await supabase.auth.signOut();
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validate passwords match
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            // Validate password length
            if (password.length < passwordMinLength) {
                setError(`Password must be at least ${passwordMinLength} characters long.`);
                return;
            }

            // Update the user's password
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                // Redirect after success
                setTimeout(() => {
                    window.location.href = routes.DASHBOARD;
                }, 2000);
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="max-w-sm mx-auto p-6 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-center text-green-600">
                            Password Updated!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-green-600 text-sm text-center">
                            Your password has been successfully updated. Redirecting...
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-sm mx-auto p-6 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Set New Password
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleResetPassword} className="space-y-3">
                        <input
                            className="border rounded px-3 py-2 w-full"
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                            minLength={passwordMinLength}
                        />

                        <input
                            className="border rounded px-3 py-2 w-full"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                            minLength={passwordMinLength}
                        />

                        {error && <div className="text-red-600 text-sm">{error}</div>}

                        <button
                            className="bg-black text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? "Updating Password..." : "Update Password"}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}