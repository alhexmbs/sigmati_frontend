<template>
    <header
        class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 md:ml-64 shadow-sm transition-all duration-300 ease-in-out">

        <div class="flex items-center gap-3">
            <button @click="$emit('toggle-sidebar')" class="md:hidden text-slate-600 hover:text-slate-900">
                <Menu class="w-6 h-6" />
            </button>
            <h2 class="text-lg md:text-xl font-semibold text-slate-800 truncate">{{ pageTitle }}</h2>
        </div>

        <!-- Server Status Monitor Removed -->

        <div class="flex items-center gap-4">
            <button @click="handleLogout"
                class="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium">
                <LogOut class="w-4 h-4" />
                <span class="hidden md:inline">Cerrar sesión</span>
            </button>
        </div>
    </header>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { LogOut, Menu } from 'lucide-vue-next';

const route = useRoute();
const authStore = useAuthStore();

defineEmits(['toggle-sidebar']);

const pageTitle = computed(() => {
    switch (route.name) {
        case 'dashboard': return 'Dashboard';
        case 'mantenimientos': return 'Gestión de mantenimientos';
        case 'alertas': return 'Monitor de alertas';
        case 'monitoreo': return 'Monitoreo de servidores';
        default: return 'SIGMATI';
    }
});

const handleLogout = () => {
    authStore.logout();
};
</script>
