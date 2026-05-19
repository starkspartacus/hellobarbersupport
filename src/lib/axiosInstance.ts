import axios from 'axios';

// Base URL for the NestJS backend
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7700/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, add interceptors to attach token if we manage it client-side
// But if we use next-auth, we might pass the token manually or attach it from session
export default axiosInstance;
