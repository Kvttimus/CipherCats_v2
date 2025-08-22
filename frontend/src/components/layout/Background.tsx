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
        </div>
    );
}