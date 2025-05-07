import api from '@/lib/api';
import { API_ROUTES } from '@/shared/api';

export const createProduct = (data: any) => api.post(API_ROUTES.PRODUCTS, data);

export const getProducts = (subdomain?: number) =>
    api.get(API_ROUTES.PRODUCTS, {
        headers: subdomain ? { Host: `${subdomain}.oferticando.com.br` } : {},
    });
export const getProductById = (id: string | number) => api.get(API_ROUTES.PRODUCT_BY_ID(id));