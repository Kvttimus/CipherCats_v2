import { Link } from "react-router-dom";
import type { PathLab } from "../model";

export function PathLabList({ labs }: { labs: PathLab[] }) {
    return (
        <ul className="space-y-2">
            {labs.map((l) => (
                <li
                    key={l.key}
                    className="p-3 rounded border"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                    <div className="font-medium">{l.title}</div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>{l.prompt}</div>
                    <Link className="underline text-sm" to={`/labs/${l.key}`}>Open</Link>
                </li>
            ))}
        </ul>
    );
}