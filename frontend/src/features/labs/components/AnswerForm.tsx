import { useState } from "react";

export function AnswerForm({ onSubmit, disabled }: { onSubmit: (answer: string) => void; disabled?: boolean; }) {
    const [answer, setAnswer] = useState("");
    return (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); onSubmit(answer.trim()); }}>
            <input className="border rounded px-3 py-2 flex-1" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your Answer" />
            <button className="bg-black text-white px-4 py-2 rounded" disabled={disabled}>Submit</button>
        </form>
    )
}