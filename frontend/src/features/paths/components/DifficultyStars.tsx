export function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
    const stars = [1, 2, 3].map((i) => (
        <span key={i} aria-hidden>
            {i <= level ? "★" : "☆"}
        </span>
    ));
    const labels: Record<1 | 2 | 3, string> = {1:"Easy", 2:"Medium", 3:"Hard"};
    return (
        <div className="flex items-center gap-2">
            <span className="text-yellow-500">{stars}</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>{labels[level]}</span>
        </div>
    );
}