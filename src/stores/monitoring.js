import { defineStore } from 'pinia';
import api from '../services/api';

export const useMonitoringStore = defineStore('monitoring', {
    state: () => ({
        servers: [],
        loading: false
    }),
    actions: {
        async fetchMonitoringData() {
            this.loading = true;
            try {
                const response = await api.get('/activos/monitoreo');
                this.servers = response.data.data || response.data;
            } catch (error) {
                console.error('Error fetching monitoring data:', error);
            } finally {
                this.loading = false;
            }
        }
    }
});
