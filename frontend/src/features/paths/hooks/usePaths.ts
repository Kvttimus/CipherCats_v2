import { useEffect, useState } from "react";
import { listPaths } from "../api";
import type { Path } from "../model";

export function usePaths() {
    const [data, setData] = useState<Path[]>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        let cancel = false;
        (async () => {
            setLoading(true);
            try { const paths = await listPaths();
                if (!cancel) setData(paths);
            } catch (e: any) {
                if (!cancel) setError(e.message ?? "Failed to load paths");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, []);

    return { data, error, loading };
}