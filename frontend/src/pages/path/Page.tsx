import { useParams } from "react-router-dom";
import { usePathLabs, DifficultyStars, PathLabList } from "@/features/paths";

export default function PathPage() {
    const { slug } = useParams<{ slug: string }>();
    const { path, labs, loading, error } = usePathLabs(slug!);

    if (loading) { return <div className="p-6">Loading…</div>; }
    if (error) { return <div className="p-6 text-red-600">{error}</div>; }
    if (!path) { return <div className="p-6">Path not found</div>; }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{path.title}</h1>
                <DifficultyStars level={path.difficulty} />
            </div>
            {path.description && <p style={{ color: "var(--muted)" }}>{path.description}</p>}
            <PathLabList labs={labs} />
        </div>
    );
}