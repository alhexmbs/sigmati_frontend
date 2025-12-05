import { defineStore } from 'pinia';
import api from '../services/api';

export const useMantenimientosStore = defineStore('mantenimientos', {
    state: () => ({
        mantenimientos: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchMantenimientos() {
            this.loading = true;
            try {
                const response = await api.get('/mantenimientos/');
                this.mantenimientos = response.data.data;
            } catch (error) {
                this.error = error;
                console.error('Error fetching mantenimientos:', error);
            } finally {
                this.loading = false;
            }
        },
        async createMantenimiento(mantenimiento) {
            try {
                const response = await api.post('/mantenimientos/', mantenimiento);
                // Assuming create returns the created object in data.data or just data
                // Usually POST returns the created object. Let's assume standard wrapper.
                // const created = response.data.data || response.data;
                // this.mantenimientos.push(created);
                // Refresh list to get the new item at the top (sorted by backend) and with full details (joins)
                await this.fetchMantenimientos();
                // return created; // We can still return the created object if needed, but it might be partial. 
                // Better to return the response data as before for the ID.
                return response.data.data || response.data;
            } catch (error) {
                console.error('Error creating mantenimiento:', error);
                throw error;
            }
        },
        async updateMantenimiento(id, mantenimiento) {
            try {
                const response = await api.put(`/mantenimientos/${id}`, mantenimiento);
                const updated = response.data.data || response.data;
                const index = this.mantenimientos.findIndex(m => m.id_mantenimiento === id);
                if (index !== -1) {
                    this.mantenimientos[index] = updated;
                }
                return updated;
            } catch (error) {
                console.error('Error updating mantenimiento:', error);
                throw error;
            }
        },
        async deleteMantenimiento(id) {
            try {
                await api.delete(`/mantenimientos/${id}`);
                this.mantenimientos = this.mantenimientos.filter(m => m.id_mantenimiento !== id);
            } catch (error) {
                console.error('Error deleting mantenimiento:', error);
                throw error;
            }
        },
        async finalizarMantenimiento(id, formData) {
            try {
                const response = await api.put(`/mantenimientos/${id}/finalizar`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const updated = response.data.data || response.data;
                const index = this.mantenimientos.findIndex(m => m.id_mantenimiento === id);
                if (index !== -1) {
                    this.mantenimientos[index] = updated;
                }
                return updated;
            } catch (error) {
                console.error('Error finalizing mantenimiento:', error);
                throw error;
            }
        },
        async extenderMantenimiento(id, payload) {
            try {
                const response = await api.put(`/mantenimientos/${id}/extender`, payload);
                const updated = response.data.data || response.data;
                const index = this.mantenimientos.findIndex(m => m.id_mantenimiento === id);
                if (index !== -1) {
                    this.mantenimientos[index] = updated;
                }
                return updated;
            } catch (error) {
                console.error('Error extending mantenimiento:', error);
                throw error;
            }
        },
        async fetchMantenimientoById(id) {
            try {
                const response = await api.get(`/mantenimientos/${id}`);
                return response.data.data || response.data;
            } catch (error) {
                console.error('Error fetching mantenimiento details:', error);
                throw error;
            }
        }
    }
});
