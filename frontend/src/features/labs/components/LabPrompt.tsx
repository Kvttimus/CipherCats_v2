import type { Lab } from "../model";

export function LabPrompt({ lab }: { lab: Lab }) {
    return (
        <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{lab.title}</h1>
            <p className="text-gray-600">{lab.prompt}</p>
        </div>
    );
}