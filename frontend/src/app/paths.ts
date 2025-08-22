export const routes = {
    ROOT: "/",
    SIGN_IN: "/sign-in",
    RESET_PASSWORD: "/sign-in/reset-password",
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    LAB: (labKey: string) => `/labs/${encodeURIComponent(labKey)}`,
    PATH: (slug: string) => `/paths/${encodeURIComponent(slug)}`,
} as const;
