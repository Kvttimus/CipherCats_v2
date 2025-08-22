import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api";
import type { Profile } from "../model";

export function useProfile() {
    const [data, setData] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect (() => {
        let cancel = false;
        (async () => {
            setLoading(true);
            try { 
                const p = await getProfile();
                if (!cancel) {
                    setData(p);
                    setError(null);
                }
            } catch (e: any) {
                if (!cancel) {
                    setError(e.message ?? "Failed to load profile");
                }
            } finally {
                if (!cancel) {
                    setLoading(false);
                }
            }
        })();
        return () => { cancel = true };
    }, []);

    async function save(patch: Partial<Profile>) {
        setSaving(true); setSaveError(null);
        try {
            const updated = await updateProfile(patch);
            setData(updated);
            return updated;
        } catch (e: any) {
            setSaveError(e.message ?? "Failed to save");
            return null;
        } finally {
            setSaving(false);
        }
    }
    
    return { data, loading, error, save, saving, saveError };
}