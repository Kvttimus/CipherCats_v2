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

export const useAuth = () => {
    const context = useContext(Ctx);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let live = true;
        (async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (!live) return;
                setSession(data.session ?? null);
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                if (live) setLoading(false);
            }
        })();
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
        return () => { live = false; sub.subscription.unsubscribe(); };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return <Ctx.Provider value={{ session, loading, signOut }}>{children}</Ctx.Provider>;
}