export const API_ROUTES = {
    CATEGORIES: '/categories',
    CATEGORY_BY_ID: (id: string | number) => `/categories/${id}`,

    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: string | number) => `/products/${id}`,

    RETAIL_STORES: '/retail-stores',
    RETAIL_STORE_BY_ID: (id: string | number) => `/retail-stores/${id}`,

    SUBCATEGORIES: '/subcategories',
    SUBCATEGORY_BY_ID: (id: string | number) => `/subcategories/${id}`,

    VENDOR_STORES: '/vendor-stores',
    VENDOR_STORE_BY_ID: (id: string | number) => `/vendor-stores/${id}`,
};