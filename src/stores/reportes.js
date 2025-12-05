import { defineStore } from 'pinia';
import api from '../services/api';

export const useReportesStore = defineStore('reportes', {
    state: () => ({
        reportesData: {
            areasMasMantenimientos: [],
            tiempoPromedioPorTipo: [],
            activosMasMantenimientos: [],
            distribucionEstado: [],
            activosMasCaidas: []
        },
        filters: {
            fechaInicio: '',
            fechaFin: ''
        },
        loading: false,
        error: null
    }),
    actions: {
        async fetchReportesData() {
            this.loading = true;
            this.error = null;
            try {
                const params = {};
                if (this.filters.fechaInicio) params.fechaInicio = this.filters.fechaInicio;
                if (this.filters.fechaFin) params.fechaFin = this.filters.fechaFin;

                const response = await api.get('/dashboard/reportes', { params });
                this.reportesData = response.data.data || response.data;
            } catch (error) {
                console.error('Error fetching reportes data:', error);
                this.error = 'Error al cargar los reportes. Por favor intente nuevamente.';
            } finally {
                this.loading = false;
            }
        },
        setFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters };
            this.fetchReportesData();
        },
        resetFilters() {
            this.filters = {
                fechaInicio: '',
                fechaFin: ''
            };
            this.fetchReportesData();
        }
    }
});
