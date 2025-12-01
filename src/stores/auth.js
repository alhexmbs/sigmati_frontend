import { defineStore } from 'pinia';
import api from '../services/api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(username, password) {
            try {
                const response = await api.post('/usuarios/login', { username, password });
                if (response.data.success) {
                    this.token = response.data.data.token;
                    this.user = response.data.data.usuario;

                    localStorage.setItem('token', this.token);
                    localStorage.setItem('user', JSON.stringify(this.user));

                    router.push('/');
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});
