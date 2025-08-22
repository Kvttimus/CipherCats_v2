import { api } from "@/lib/http";
import type { Profile } from "./model";

export const getProfile = () => api<Profile>("/profile");

export function updateProfile(patch: Partial<Profile>) {
    // const { display_name = "", avatar_url = "", theme = "system" } = patch;
    // return api<Profile>("/profile", {
    //     method: "PATCH",
    //     body: JSON.stringify({ display_name, avatar_url, theme }),
    // });

    const body = JSON.stringify({
        display_name: patch.display_name ?? "",
        avatar_url: patch.avatar_url ?? "",
        theme: patch.theme ?? "system",
    });
    return api<Profile>("/profile", { method: "PATCH", body });
}
