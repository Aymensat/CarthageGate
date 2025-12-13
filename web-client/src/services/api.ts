import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Use the proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
