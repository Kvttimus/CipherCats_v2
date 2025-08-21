import { Link } from "react-router-dom";
import type { Path } from "../model";
import { DifficultyStars } from "./DifficultyStars";

export function PathCard({ path }: { path: Path }) {
    return (
        <Link
            to={`/paths/${path.slug}`}
            className="block rounded-2xl p-4 border hover:shadow-sm transition"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{path.title}</h3>
                <DifficultyStars level={path.difficulty} />
            </div>
            {path.description && (
                <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                    {path.description}
                </p>
            )}
        </Link>
    );
}