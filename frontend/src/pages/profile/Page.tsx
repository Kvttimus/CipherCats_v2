import { useState } from "react";
import { useProfile } from "@/features/settings";

export default function ProfilePage() {
    const { data: profile, loading, error, save, saving, saveError } = useProfile();
    const [savedMsg, setSavedMsg] = useState<string | null>(null);

    if (loading) return <div className="p-6">Loading settings…</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!profile) return null;

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSavedMsg(null);
        const fd = new FormData(e.currentTarget);
        const patch = {
            display_name: String(fd.get("display_name") || ""),
            avatar_url: String(fd.get("avatar_url") || ""),
            theme: (String(fd.get("theme") || "system") as "system" | "light" | "dark"),
        };
        const res = await save(patch); // await so we can show feedback
        if (res) setSavedMsg("Saved!");
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1" htmlFor="display_name">Display name</label>
                    <input
                        id="display_name" name="display_name"
                        defaultValue={profile.display_name}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1" htmlFor="avatar_url">Avatar URL</label>
                    <input
                        id="avatar_url" name="avatar_url"
                        defaultValue={profile.avatar_url}
                        placeholder="https://…/avatar.png"
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1" htmlFor="theme">Theme</label>
                    <select
                        id="theme" name="theme"
                        defaultValue={profile.theme}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                {saveError && <div className="text-red-600 text-sm">{saveError}</div>}
                {savedMsg && !saveError && <div className="text-green-700 text-sm">{savedMsg}</div>}

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    {saving ? "Saving…" : "Save changes"}
                </button>
            </form>
        </div>
    );

    // function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault();
    //     const fd = new FormData(e.currentTarget);
    //     const displayName = String(fd.get("display_name") || "");
    //     const avatarUrl = String(fd.get("avatar_url") || "");
    //     const theme = (String(fd.get("theme") || "system") as "system" | "light" | "dark");
    //     save({ displayName: displayName, avatarUrl: avatarUrl, theme });
    // }

    // return (
    //     <div className="max-w-xl mx-auto p-6 space-y-6">
    //         <h1 className="text-2xl font-semibold">Settings</h1>
    //         <form onSubmit={onSubmit} className="space-y-4">
    //             <div>
    //                 <label className="block text-sm mb-1">Display name</label>
    //                 <input
    //                     name="display_name"
    //                     defaultValue={profile.displayName}
    //                     className="border rounded px-3 py-2 w-full"
    //                 />
    //             </div>

    //             <div>
    //                 <label className="block text-sm mb-1">Avatar URL</label>
    //                 <input
    //                     name="avatar_url"
    //                     defaultValue={profile.avatarUrl}
    //                     placeholder="https://…/avatar.png"
    //                     className="border rounded px-3 py-2 w-full"
    //                 />
    //             </div>

    //             <div>
    //                 <label className="block text-sm mb-1">Theme</label>
    //                 <select
    //                     name="theme"
    //                     defaultValue={profile.theme}
    //                     className="border rounded px-3 py-2 w-full"
    //                 >
    //                     <option value="system">System</option>
    //                     <option value="light">Light</option>
    //                     <option value="dark">Dark</option>
    //                 </select>
    //             </div>

    //             {saveError && <div className="text-red-600 text-sm">{saveError}</div>}

    //             <button disabled={saving} className="bg-black text-white px-4 py-2 rounded">
    //                 {saving ? "Saving…" : "Save changes"}
    //             </button>
    //         </form>
    //     </div>
    // );
}