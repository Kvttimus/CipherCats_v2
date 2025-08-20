// Fails on missing ENV's

export const env = (() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
    if (!url || !anon) throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
    const apiBase = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
    return { SUPABASE_URL: url, SUPABASE_ANON_KEY: anon, API_BASE: apiBase };
})();