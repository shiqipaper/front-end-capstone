import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/users/register`, userData);
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/users/login`, userData);
};

export const getPlants = async (page = 1, perPage = 10, search = '') => {
    return await axios.get(`${API_URL}/plants`, {
        params: { page, per_page: perPage, search }
    });
};

export const getUserProfile = async (token) => {
    return await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateUserProfile = async (token, updateData) => {
    return await axios.put(`${API_URL}/users/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
