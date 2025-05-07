import api from '@/lib/api';
import { API_ROUTES } from '@/shared/api';

export const createRetailStore = (data: any) => api.post(API_ROUTES.RETAIL_STORES, { data });

export const getRetailStores = () => api.get(API_ROUTES.RETAIL_STORES);
export const getRetailStoreById = (id: string | number) => api.get(API_ROUTES.RETAIL_STORE_BY_ID(id));