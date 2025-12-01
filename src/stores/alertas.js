import { defineStore } from 'pinia';
import api from '../services/api';

export const useAlertasStore = defineStore('alertas', {
    state: () => ({
        alertas: [],
        socket: null,
        connected: false
    }),
    actions: {
        async fetchAlertas() {
            try {
                const response = await api.get('/alertas/');
                this.alertas = response.data.data || response.data;
            } catch (error) {
                console.error('Error fetching alertas:', error);
            }
        },
        connectWebSocket() {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

            this.socket = new WebSocket('wss://sigmatibackend-production.up.railway.app');

            this.socket.onopen = () => {
                console.log('WebSocket Connected');
                this.connected = true;
            };

            this.socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'alerta-nueva') {
                        this.alertas.unshift(message.data);
                        // Optional: Add notification logic here or in the component
                    }
                } catch (e) {
                    console.error('Error parsing WebSocket message:', e);
                }
            };

            this.socket.onclose = () => {
                console.log('WebSocket Disconnected. Reconnecting in 5s...');
                this.connected = false;
                setTimeout(() => this.connectWebSocket(), 5000);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
        },
        async simularFalla(idActivo) {
            return api.post('/simulador/falla', { id_activo: idActivo });
        },
        async simularRecuperacion(idActivo) {
            return api.post('/simulador/recuperacion', { id_activo: idActivo });
        }
    }
});
