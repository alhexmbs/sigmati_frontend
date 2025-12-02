import { defineStore } from 'pinia';
import api from '../services/api';

export const useResourcesStore = defineStore('resources', {
    state: () => ({
        activos: [],
        areas: [],
        roles: [],
        usuarios: [],
        tiposMantenimiento: [],
        tiposActivos: [],
        loading: false
    }),
    actions: {
        async fetchAll() {
            this.loading = true;
            try {
                await Promise.all([
                    this.fetchActivos(),
                    this.fetchAreas(),
                    this.fetchRoles(),
                    this.fetchUsuarios(),
                    this.fetchTiposMantenimiento(),
                    this.fetchTiposActivos()
                ]);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchActivos(params = {}) {
            try {
                const response = await api.get('/activos', { params });
                this.activos = response.data.data;
            } catch (e) { console.error('Error fetching activos', e); }
        },
        // Fetch assets for multiple areas and combine them
        async fetchActivosForAreas(areaIds) {
            if (!areaIds || areaIds.length === 0) {
                this.activos = [];
                return;
            }
            this.loading = true;
            try {
                const promises = areaIds.map(id => api.get('/activos', { params: { id_area: id } }));
                const responses = await Promise.all(promises);

                // Combine all data arrays
                const allActivos = responses.flatMap(r => r.data.data);

                // Remove duplicates if any (though unlikely if areas are distinct)
                const uniqueActivos = Array.from(new Map(allActivos.map(item => [item.id_activo, item])).values());

                this.activos = uniqueActivos;
            } catch (e) {
                console.error('Error fetching activos for areas', e);
            } finally {
                this.loading = false;
            }
        },
        async fetchAreas(search = '') {
            try {
                const params = search ? { search } : {};
                const response = await api.get('/areas', { params });
                this.areas = response.data.data;
            } catch (e) { console.error('Error fetching areas', e); }
        },
        async fetchRoles() {
            try {
                const response = await api.get('/rol');
                this.roles = response.data.data;
            } catch (e) { console.error('Error fetching roles', e); }
        },
        async fetchUsuarios() {
            try {
                const response = await api.get('/usuarios');
                this.usuarios = response.data.data;
            } catch (e) { console.error('Error fetching usuarios', e); }
        },
        async fetchTiposMantenimiento() {
            try {
                const response = await api.get('/tipos-mantenimiento');
                this.tiposMantenimiento = response.data.data;
            } catch (e) { console.error('Error fetching tipos', e); }
        },
        async fetchTiposActivos() {
            try {
                const response = await api.get('/activos/tipos');
                this.tiposActivos = response.data.data;
            } catch (e) { console.error('Error fetching tipos activos', e); }
        }
    }
});
