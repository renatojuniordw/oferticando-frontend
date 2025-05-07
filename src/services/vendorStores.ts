import api from '@/lib/api';
import { API_ROUTES } from '@/shared/api';

export const getVendorStores = () => api.get(API_ROUTES.VENDOR_STORES);

export const getVendorStoreById = (id: string | number) => api.get(API_ROUTES.VENDOR_STORE_BY_ID(id));
