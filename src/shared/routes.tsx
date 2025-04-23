export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    PROFILE: {
        DATA: '/profile/data',
        SETTINGS: '/profile/settings',
        PROMOTIONS: '/profile/promotions',
        PROMOTIONS_NEW: '/profile/promotions/new',
        PROMOTIONS_EDIT: (id: string | number) => `/profile/promotions/${id}/edit`
    },

    PROMOTION_VIEW: (id: string | number) => `/promotion/${id}/view`,
};