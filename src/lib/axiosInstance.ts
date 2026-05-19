import axios from 'axios';

// Base URL for the NestJS backend. Use 127.0.0.1 to avoid Node.js IPv6 localhost issues
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:7700/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, add interceptors to attach token if we manage it client-side
// But if we use next-auth, we might pass the token manually or attach it from session
export default axiosInstance;
