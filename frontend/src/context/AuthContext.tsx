import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const Ctx = createContext<{
    session: Session | null; 
    loading: boolean;
    signOut: () => Promise<void>;
 }>({ 
    session: null, 
    loading: true,
    signOut: async () => {} 
});

export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let live = true;
        (async () => {
            const { data } = await supabase.auth.getSession();
            if (!live) return;
            setSession(data.session ?? null);
            setLoading(false);
        })();
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
        return () => { live = false; sub.subscription.unsubscribe(); };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return <Ctx.Provider value={{ session, loading, signOut }}>{children}</Ctx.Provider>;
}