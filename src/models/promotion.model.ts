export interface Promotion {
    id: number;
    title: string;
    store: string;
    creator: string;
    image: string;
    user?: string;
    link: string;
    clicks?: number;
}