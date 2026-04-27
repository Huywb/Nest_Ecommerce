export const BASE_URL_V1 = 'http://localhost:3000/api/v1'


export const API_BASE = {
    AUTH:{
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        LOGIN: '/auth/login'
    },
    CART: {
        GET_ALL_CART: '/cart',
        ADD_TO_CART: '/cart/items',
        UPDATE_QUANTITY_CART: (id: string) => `/cart/items/${id}`,
        DELETE_ITEM_CART: (id: string) => `/cart/items/${id}`,
        DELETE_ALL_CART: '/cart',
        MERGE_CART: '/cart/merge',
    },
    CATEGORY: {
        CREATE_CATEGORY: '/category',
        GET_ALL_CATEGORY: '/category',
        GET_CATEGORY_BY_ID: (id: string) => `/category/${id}`,
        GET_CATEGORY_BY_SLUG: (slug: string) => `/category/slug/${slug}`,
        UPDATE_CATEGORY_BY_ID: (id: string) => `/category/${id}`,
        DELETE_CATEGORY_BY_ID: (id: string) => `/category/${id}`,
        DELETE_CATEGORY: '/category/all',
    },
    ORDER: {
        CREATE_ORDER: '/order',
        GET_ALL_ORDERS: '/order/admin/all',
        GET_MY_ORDERS: '/order',
        GET_ORDER_BY_ADMIN: (id: string) => `/order/admin/${id}`,
        GET_ORDER_BY_ID: (id: string) => `/order/${id}`,
        UPDATE_ORDER_BY_ADMIN: (id: string) => `/order/admin/${id}`,
        UPDATE_ORDER_BY_USER: (id: string) => `/order/${id}`,
        DELETE_ORDER_BY_ADMIN: (id: string) => `/order/admin/${id}`,
        DELETE_ORDER_BY_USER: (id: string) => `/order/${id}`,
    },
    PAYMENT: {
        CREATE_PAYMENT_INTENT: '/payments/create-intent',
        CONFIRM_PAYMENT: '/payments/confirm',
        GET_ALL_PAYMENTS: '/payments',
        GET_PAYMENT_BY_ID: (id: string) => `/payments/${id}`,
        GET_PAYMENTS_BY_ORDER: (orderId: string) => `/payments/order/${orderId}`,
    },
    PRODUCT: {
        CREATE_PRODUCT: '/product',
        GET_ALL_PRODUCTS: '/product',
        GET_PRODUCT_BY_ID: (id: string) => `/product/${id}`,
        UPDATE_PRODUCT_BY_ID: (id: string) => `/product/${id}`,
        UPDATE_PRODUCT_STOCK_BY_ID: (id: string) => `/product/${id}/stock`,
        DELETE_PRODUCT_BY_ID: (id: string) => `/product/${id}`,
        DELETE_ALL_PRODUCTS: '/product',
    },
    USER: {
        GET_MY_PROFILE: '/user/me',
        GET_ALL_USERS: '/user',
        GET_USER_BY_ID: (id: string) => `/user/${id}`,
        UPDATE_USER_BY_ID: `/user/me`,
        UPDATE_PASSWORD_BY_ID: (id: string) => `/user/${id}/password`,
        DELETE_USER_BY_ID: (id: string) => `/user/${id}`,
    },
}