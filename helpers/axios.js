import { getLocal } from "@/utility";
import axios from "axios";
const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    credentials: 'include',
    headers: {
        Accept: "application/json",
        "Authorization": `Bearer ${getLocal('old_token')}`,
        "Content-Type": 'multipart/form-data',
    },
    withCredentials: true
});

export default api;


// import axios from 'axios';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   },
//   withCredentials: true // This is important for CORS with credentials
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Get token from cookies
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle common errors here
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Response Error:', error.response.data);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('Request Error:', error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Error:', error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default api; 
