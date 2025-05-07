export interface Promotion {
    id: number;
    title: string;
    description: string;
    affiliate_link: string;
    resolved_link: string;
    active: boolean;
    slug: string;
    categoryId: string;
    subcategoryId: string;
    retailStoreId: string;
    image_url: string;

    retail_store: any;
    user: any;
    category: any;
}