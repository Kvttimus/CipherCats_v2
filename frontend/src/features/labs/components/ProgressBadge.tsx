export function ProgressBadge({ correct }: { correct: boolean }) {
    return (
        <span className={`px-2 py-1 rounded text-sm ${correct ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
            { correct ? "Correct" : "Try again"}
        </span>
    );
}