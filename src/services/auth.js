import api from '@/lib/axios';

export const authService = {
    async login({ email, password }) {
      const response = await api.post('/login', { 
        email, 
        password
      });
      console.log("login body",response);
      
      return response.data;
    },

    async register({ name, email, password, role }) {
      const response = await api.post('/register', { 
        name,
        email, 
        password,
        role
      });
      return response.data;
    },

    async googleLogin({ google_token, role }) {
      const response = await api.post('/google/login', { 
        google_token,
        role
      });
      return response.data;
    },
    
    async googleCallback({ code, role }) {
      const response = await api.post('/google/callback', { 
        code,
        role
      });
      return response.data;
    },

    async logout() {
      const response = await api.post('/logout');
      return response.data;
    }
};