import { defineStore } from 'pinia';
import api from '../services/api';

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        resumen: {
            totalServicios: 0,
            serviciosCaidos: 0,
            mantenimientosPendientes: 0,
            alertasHoy: 0
        },
        graficos: {
            alertasPorDia: [],
            mantenimientosPorTipo: [],
            estadoActivos: []
        },
        loading: false
    }),
    actions: {
        async fetchDashboardData() {
            this.loading = true;
            try {
                const [resumenRes, graficosRes] = await Promise.all([
                    api.get('/dashboard/resumen'),
                    api.get('/dashboard/graficos')
                ]);
                this.resumen = resumenRes.data.data || resumenRes.data;
                this.graficos = graficosRes.data.data || graficosRes.data;
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                this.loading = false;
            }
        }
    }
});
