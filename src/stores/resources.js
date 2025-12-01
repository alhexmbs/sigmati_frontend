import { defineStore } from 'pinia';
import api from '../services/api';

export const useResourcesStore = defineStore('resources', {
    state: () => ({
        activos: [],
        areas: [],
        roles: [],
        usuarios: [],
        tiposMantenimiento: [],
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
                    this.fetchTiposMantenimiento()
                ]);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchActivos() {
            try {
                const response = await api.get('/activos');
                this.activos = response.data.data;
            } catch (e) { console.error('Error fetching activos', e); }
        },
        async fetchAreas() {
            try {
                const response = await api.get('/areas');
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
        }
    }
});
