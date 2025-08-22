// fetch wrapper with auth

import { env } from "./env";
import { getAccessToken } from "./supabase";

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getAccessToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${env.API_BASE}${path}`, { ...init, headers });
    if (!res.ok) {
        let detail: unknown;
        try { detail = await res.json(); } catch{}
        throw new Error(`API ${res.status} ${res.statusText}: ${JSON.stringify(detail)}`);
    }
    return res.json() as Promise<T>;
}