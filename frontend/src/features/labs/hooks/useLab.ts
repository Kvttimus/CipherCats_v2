import { useEffect, useState } from "react";
import { getLab } from "../api";
import type { Lab } from "../model";

export function useLab(key: string) {
    const [data, setData] = useState<Lab | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let abort = false;
        setLoading(true);
        setError(null);

        getLab(key)
            .then((lab) => {
                if (abort) return;
                setData(lab);
                setError(null);
            })
            .catch((e) => {
                if (abort) return;
                setError(e.message);
                setData(null);
            })
            .finally(() => {
                if (abort) return;
                setLoading(false);
            });

        return () => { abort = true; };
    }, [key]);

    return { data, error, loading };
}