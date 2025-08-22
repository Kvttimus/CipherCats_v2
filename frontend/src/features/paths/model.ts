export type Path = {
    id: number;
    slug: string;
    title: string;
    description: string;
    difficulty: 1 | 2 | 3;
};

export type PathLab = {
    key: string;
    title: string;
    prompt: string;
    position: number;
};