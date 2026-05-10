import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// Restaurants API
export const getRestaurants = (params) => api.get('/restaurants', { params });
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const createRestaurant = (data) => api.post('/restaurants', data);
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);

// Plats API
export const getPlats = (params) => api.get('/plats', { params });
export const getPlatById = (id) => api.get(`/plats/${id}`);
export const createPlat = (data) => api.post('/plats', data);
export const updatePlat = (id, data) => api.put(`/plats/${id}`, data);
export const deletePlat = (id) => api.delete(`/plats/${id}`);

// Commandes API
export const createCommande = (data) => api.post('/commandes', data);
export const getCommandes = () => api.get('/commandes');
export const getCommandeById = (id) => api.get(`/commandes/${id}`);
export const updateCommandeStatus = (id, statut) => api.put(`/commandes/${id}/statut`, { statut });

// Users API (admin only