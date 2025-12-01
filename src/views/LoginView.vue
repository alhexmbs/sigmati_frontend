<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-100">
        <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div class="text-center mb-8">
                <div
                    class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 text-amber-500 mb-4">
                    <Activity class="w-8 h-8" />
                </div>
                <h1 class="text-2xl font-bold text-slate-900">Bienvenido a SIGMATI</h1>
                <p class="text-slate-500 mt-2">Sistema de Gestión de Mantenimiento TI</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
                <Input v-model="username" label="Usuario" id="username" placeholder="admin" required />

                <Input v-model="password" label="Contraseña" id="password" type="password" placeholder="••••••"
                    required />

                <div v-if="error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {{ error }}
                </div>

                <Button type="submit" class="w-full" :disabled="loading">
                    {{ loading ? 'Ingresando...' : 'Ingresar' }}
                </Button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Activity } from 'lucide-vue-next';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    try {
        await authStore.login(username.value, password.value);
    } catch (e) {
        error.value = 'Credenciales inválidas o error de conexión';
    } finally {
        loading.value = false;
    }
};
</script>
