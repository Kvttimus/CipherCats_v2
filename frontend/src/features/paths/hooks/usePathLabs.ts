import { useEffect, useState } from "react";
import { getPathLabs } from "../api";
import type { Path, PathLab } from "../model";

export function usePathLabs(slug: string) {
    const [path, setPath] = useState<Path | null>(null);
    const [labs, setLabs] = useState<PathLab[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancel = false;
        (async () => {
            setLoading(true);
            try {
                const res = await getPathLabs(slug);
                if (!cancel) { 
                    setPath(res.path); 
                    setLabs(res.labs); 
                }
            } catch (e: any) {
                if (!cancel) { 
                        setError(e.message ?? "Failed to load labs for path");
                    }
            } finally {
                if (!cancel) {
                    setLoading(false);
                }
            }
        })();
        return () => { cancel = true; };
    }, [slug]);

    return { path, labs, error, loading };
}