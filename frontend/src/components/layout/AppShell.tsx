// Layout for authenticated pages

import { Outlet } from "react-router-dom";
import Background from "./Background";
import Header from "./Header";

export default function AppShell() {
    return (
        <>
            <Background />
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-10">
                <Outlet />
            </main>
            <footer className="mt-10 border-t border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted">
                    © {new Date().getFullYear()} CipherCats
                </div>
            </footer>
        </>
    );
}