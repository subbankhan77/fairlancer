import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  
  // If role exists in session, add it to headers for role-based API functionality
  if (session?.user?.role) {
    config.headers['X-User-Role'] = session.user.role;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Token missing or invalid');
    } else if (error.response?.status === 403) {
      console.error('Forbidden: Insufficient permissions', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Helper function to check if role exists in session
export const getUserRole = async () => {
  const session = await getSession();
  return session?.user?.role || null;
};

export default api;