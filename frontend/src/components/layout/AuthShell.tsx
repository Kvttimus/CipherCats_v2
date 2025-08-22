// Layout for un-authenticated pages

import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import Background from "./Background";

export default function AppShell() {
    return (
        <>
            <Background />
            <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
                    <Link to="/" className="font-semibold tracking-wide">
                        <span className="text-brand">Cipher</span>Cats
                    </Link>
                </div>
            </header>
            
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