export type Profile = {
    user_id: string;
    display_name: string;
    avatar_url: string;
    theme: "system" | "light" | "dark";
    updated_at: string | null;
};