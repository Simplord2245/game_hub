export const API_CONFIG = {
  baseUrl: 'http://localhost:8088/api',
  endpoints: {
    health: '/health',
    register: '/auth/register',
    login: '/auth/login',
    games: '/games',
    categories: '/categories',
    products: '/products',
    orders: '/orders',
    payments: '/payments',
    wallet: '/wallet'
  },
  timeoutMs: 3000
};
