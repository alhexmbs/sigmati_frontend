import { defineStore } from 'pinia';
import api from '../services/api';

const audioAlerta = new Audio('/red_alert_V1.mp3');

export const useAlertasStore = defineStore('alertas', {
    state: () => ({
        alertas: [],
        socket: null,
        connected: false,
        alertaPopup: null
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
                        if (message.data.severidad === 'CRITICAL') {
                            this.playAudio();

                            this.alertaPopup = {
                                ...message.data,
                                id: Date.now()
                            };

                            // Opcional: Auto-cerrar después de 10 segundos
                            setTimeout(() => {
                                // Solo cerrar si sigue siendo la misma alerta
                                if (this.alertaPopup && this.alertaPopup.id === message.data.id) {
                                    this.alertaPopup = null;
                                }
                            }, 10000);
                        }
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
        playAudio() {
            try {
                audioAlerta.currentTime = 0;
                audioAlerta.play().catch(error => {
                    console.warn('El navegador bloqueó el sonido. El usuario debe interactuar primero con la página.', error);
                });
            } catch (e) {
                console.error("Error al reproducir sonido", e);
            }
        },
        unlockAudio() {
            // Intenta reproducir y pausar inmediatamente
            // Esto "engaña" al navegador para que habilite el sonido futuro
            audioAlerta.play().then(() => {
                audioAlerta.pause();
                audioAlerta.currentTime = 0;
                console.log('Audio desbloqueado para esta sesión');
            }).catch(e => {
                // Si falla, no importa, lo intentará en el próximo clic
            });
        },
        cerrarPopup() {
            this.alertaPopup = null;
        },
        async simularFalla(idActivo) {
            return api.post('/simulador/falla', { id_activo: idActivo });
        },
        async simularRecuperacion(idActivo) {
            return api.post('/simulador/recuperacion', { id_activo: idActivo });
        }
    }
});
