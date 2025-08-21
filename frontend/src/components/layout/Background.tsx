export default function Background() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
            {/* faint grid */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.08]">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* corner glows */}
            {/* <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-20"
                style={{ background: "radial-gradient(circle, hsl(188 100% 50% / .35), transparent 60%)" }} />
            <div className="absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-20"
                style={{ background: "radial-gradient(circle, hsl(280 100% 65% / .35), transparent 60%)" }} /> */}
        </div>
    );
}