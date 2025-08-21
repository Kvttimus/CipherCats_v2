import { Link, NavLink } from "react-router-dom";

export default function Header() {
    const link = "text-sm text-[hsl(var(--fg))]/70 hover:text-white transition";
    return (
        <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
                <Link to="/" className="font-semibold tracking-wide">
                    <span className="text-brand">Cipher</span>Cats
                </Link>
                <nav className="ml-auto flex items-center gap-4">
                    <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
                    <NavLink to="/labs/codebreaker-1" className={link}>Labs</NavLink>
                </nav>
            </div>
        </header>
    );
}