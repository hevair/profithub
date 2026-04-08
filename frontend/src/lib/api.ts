import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; password: string; name?: string; tenantName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const productsApi = {
  getAll: () => api.get('/products'),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const ordersApi = {
  getAll: () => api.get('/orders'),
  create: (data: any) => api.post('/orders', data),
};

export const reportsApi = {
  getDashboard: () => api.get('/reports/dashboard'),
  getProductsProfit: () => api.get('/reports/products'),
};

export const alertsApi = {
  getAll: () => api.get('/alerts'),
  markAsRead: (id: string) => api.put(`/alerts/${id}/read`),
  delete: (id: string) => api.delete(`/alerts/${id}`),
};

export default api;
