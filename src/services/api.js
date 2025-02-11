import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }


    const { status } = error.response;
    const { url } = error.config;

    if (status === 401) {
      if (url.endsWith('/login') || url.includes('/login')) {
        return Promise.reject(error);
      }

      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
    return await apiClient.post(`${API_URL}/users/register`, userData);
};

export const getUserProfile = async (token) => {
  return apiClient.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const loginUser = async (userData) => {
    return await apiClient.post(`${API_URL}/users/login`, userData);
};

export const getPlants = async (page = 1, perPage = 10, search = '') => {
    return await apiClient.get(`${API_URL}/plants`, {
        params: { page, per_page: perPage, search }
    });
};


export const updateUserProfile = async (token, updateData) => {
    return await apiClient.put(`${API_URL}/users/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const likePlant = async (plantId, token) => {
  return apiClient.post(`${API_URL}/plants/${plantId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const savePlant = async (plantId, token) => {
  return apiClient.post(`${API_URL}/plants/${plantId}/save`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getSavedPlants = async (token, page = 1, perPage = 10) => {
  return apiClient.get(`${API_URL}/users/saved-plants`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { page, per_page: perPage }
    });
};
