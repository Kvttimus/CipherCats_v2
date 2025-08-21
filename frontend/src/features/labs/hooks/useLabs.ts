import { useEffect, useState } from "react";
import { listLabs } from "../api";
import type { LabSummary } from "../model";

export function useLabs() {
    const [data, setData] = useState<LabSummary[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let abort = false;
        setLoading(true);

        listLabs()
            .then((labs) => {
                if (!abort) { setData(labs); setError(null); }
            })
            .catch((e) => {
                if (!abort) setError(e.message);
            })
            .finally(() => {
                if (!abort) setLoading(false);
            });
        return () => { abort = true; };
    }, []);

    return { data, error, loading };
}