import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error signing up' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error logging in' };
  }
};

export const faceLogin = async (data) => {
  try {
    const response = await api.post('/auth/face-login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error with face login' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error getting user profile' };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.patch('/users/me', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating user profile' };
  }
};

export const saveFaceData = async (faceData) => {
  try {
    const response = await api.post('/auth/save-face', faceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error saving face data' };
  }
};

export const disableFaceRecognition = async () => {
  try {
    const response = await api.post('/users/disable-face-recognition');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error disabling face recognition' };
  }
};

export default api; 