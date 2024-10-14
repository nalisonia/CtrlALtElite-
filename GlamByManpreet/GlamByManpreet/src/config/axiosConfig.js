// // src/config/axiosConfig.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'http://localhost:3000', // Update this to your backend API URL
//     timeout: 1000, // Timeout in milliseconds
//     headers: {
//         'Content-Type': 'application/json', // Set the default content type
//     },
// });

// export default axiosInstance;

import axios from 'axios';

// Determine baseURL from environment variables
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // Use environment variable or default to localhost

const axiosInstance = axios.create({
    baseURL: baseURL, // Set base URL from environment
    timeout: 5000, // Set a more generous timeout in milliseconds
    headers: {
        'Content-Type': 'application/json', // Set the default content type
    },
});

// Add a request interceptor to include auth tokens or other headers
axiosInstance.interceptors.request.use(
    (config) => {
        // Example: Add an Authorization token if it exists in localStorage or state
        const token = localStorage.getItem('authToken'); // Adjust based on your auth logic
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses globally if needed
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Example: Handle unauthorized errors globally
            console.error('Unauthorized access - possibly redirect to login');
            // Optionally, you can redirect to login or show a message here
        }
        return Promise.reject(error); // Forward the error to be handled locally in the component
    }
);

export default axiosInstance;
