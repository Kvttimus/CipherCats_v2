import { Link } from "react-router-dom";
import { useLabs } from "@/features/labs/hooks/useLabs";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { data: labs, loading, error } = useLabs();
    const { signOut } = useAuth();

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <button
                    className="text-sm underline hover:no-underline"
                    onClick={signOut}
                >
                    Sign out
                </button>
            </div>

            <h2 className="text-lg font-semibold">Labs</h2>
            {loading && <div className="text-gray-600">Loading labs…</div>}
            {error && <div className="text-red-600">Error: {error}</div>}
            {!loading && !error && (
                <ul className="space-y-2">
                    {labs.map((l) => (
                        <li key={l.key} className="p-3 rounded border" style={{ borderColor: "var(--border)" }}>
                            <div className="font-medium">{l.title}</div>
                            <div className="text-sm" style={{ color: "var(--muted)" }}>{l.prompt}</div>
                            <Link className="underline text-sm" to={`/labs/${l.key}`}>Open</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}