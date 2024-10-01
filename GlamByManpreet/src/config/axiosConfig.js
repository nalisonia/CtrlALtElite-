// src/config/axiosConfig.js
import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: 'https://your-api-url.com', // Replace with your actual API base URL
    timeout: 10000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        // You can add other headers here, e.g., authorization headers
    },
});

// Optional: Add interceptors for request/response handling
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token or other configurations here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        return Promise.reject(error);
    }
);

export default axiosInstance;
