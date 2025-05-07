import api from '@/lib/api';
import { API_ROUTES } from '@/shared/api';

export const getSubcategories = () => api.get(API_ROUTES.SUBCATEGORIES);

export const getSubcategoryById = (id: string | number) => api.get(API_ROUTES.SUBCATEGORY_BY_ID(id));