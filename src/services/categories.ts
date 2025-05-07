import api from '@/lib/api';
import { API_ROUTES } from '@/shared/api';

export const getCategories = () => api.get(API_ROUTES.CATEGORIES);
export const getCategoryById = (id: string | number) => api.get(API_ROUTES.CATEGORY_BY_ID(id));