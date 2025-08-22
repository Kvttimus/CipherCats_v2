// supabase client & token

import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export async function getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
}