<template>
    <header
        class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40 ml-64 shadow-sm">
        <h2 class="text-xl font-semibold text-slate-800">{{ pageTitle }}</h2>

        <div class="flex items-center gap-4">
            <button @click="handleLogout"
                class="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium">
                <LogOut class="w-4 h-4" />
                <span>Cerrar sesión</span>
            </button>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { LogOut } from 'lucide-vue-next';

const route = useRoute();
const authStore = useAuthStore();

const pageTitle = computed(() => {
    switch (route.name) {
        case 'dashboard': return 'Dashboard';
        case 'mantenimientos': return 'Gestión de mantenimientos';
        case 'alertas': return 'Monitor de alertas';
        case 'simulador': return 'Simulador de fallas';
        default: return 'SIGMATI';
    }
});

const handleLogout = () => {
    authStore.logout();
};
</script>
