import { cn } from "@/lib/cn";

export default function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span {...props}
            className={cn("inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs", className)}
        />
    );
}