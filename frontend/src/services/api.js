import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const getDonations = async () => {
    const response = await api.get('/donations/');
    return response.data;
};

export const createDonation = async (donationData) => {
    const response = await api.post('/donations/', donationData);
    return response.data;
};

export const deleteDonation = async (id) => {
    await api.delete(`/donations/${id}`);
};