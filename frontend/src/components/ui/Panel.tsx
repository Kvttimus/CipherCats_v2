import { cn } from "@/lib/cn";

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div {...props} className={cn("surface p-5", className)} />;
}