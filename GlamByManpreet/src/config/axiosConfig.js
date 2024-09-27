// src/config/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Update this to your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;