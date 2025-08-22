import { useAuth } from "@/context/AuthContext";
import { usePaths, PathCard } from "@/features/paths";
import { useProfile } from "@/features/settings/hooks/useProfile";

export default function DashboardPage() {
    // const { data: labs, loading, error } = useLabs();
    const { data: paths = [], loading, error } = usePaths();
    const { signOut, session } = useAuth();
    const { data: profile, loading: loadingProfile } = useProfile();

    const name =
        (profile?.display_name?.trim() || "") ||
        (session?.user?.user_metadata?.full_name as string | undefined) ||
        (session?.user?.email ? session.user.email.split("@")[0] : "") ||
        "there";

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">{loadingProfile ? "Loading…" : `Welcome, ${name}`}</h1>
                <button
                    className="text-sm underline hover:no-underline"
                    onClick={signOut}
                >
                    Sign out
                </button>
            </div>

            <h2 className="text-lg font-semibold">Paths</h2>
            {loading && <div className="text-gray-600">Loading paths…</div>}
            {error && <div className="text-red-600">Error: {error}</div>}
            {!loading && !error && (
                <div className="grid sm:grid-cols-2 gap-4">
                    {paths.map((p) => (<PathCard key={p.slug} path={p} />))}
                </div>
            )}
        </div>
    );
}