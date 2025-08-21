import { api } from "@/lib/http";
import type { Path, PathLab } from "./model";

export function listPaths() {
    return api<Path[]>("/paths")
}

export function getPathLabs(slug: string) {
    return api<{ path: Path; labs: PathLab[] }>(`/paths/${encodeURIComponent(slug)}/labs`);
}