<template>
    <header
        class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 md:ml-64 shadow-sm transition-all duration-300 ease-in-out">

        <div class="flex items-center gap-3">
            <button @click="$emit('toggle-sidebar')" class="md:hidden text-slate-600 hover:text-slate-900">
                <Menu class="w-6 h-6" />
            </button>
            <h2 class="text-lg md:text-xl font-semibold text-slate-800 truncate">{{ pageTitle }}</h2>
        </div>

        <!-- Server Status Monitor -->
        <div class="hidden lg:flex items-center gap-4 mr-auto ml-8">
            <div v-for="server in servers" :key="server.id_activo"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                <Server class="w-4 h-4" :class="server.estado === 'Operativo' ? 'text-green-600' : 'text-red-600'" />
                <div class="flex flex-col leading-none">
                    <span class="text-xs font-semibold text-slate-700">{{ server.nombre }}</span>
                    <span class="text-[10px] font-medium"
                        :class="server.estado === 'Operativo' ? 'text-green-600' : 'text-red-600'">
                        {{ server.estado }}
                    </span>
                </div>
            </div>
        </div>

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
import { useMonitoringStore } from '@/stores/monitoring';
import { LogOut, Menu, Server } from 'lucide-vue-next';

const route = useRoute();
const authStore = useAuthStore();
const monitoringStore = useMonitoringStore();

defineEmits(['toggle-sidebar']);

const pageTitle = computed(() => {
    switch (route.name) {
        case 'dashboard': return 'Dashboard';
        case 'mantenimientos': return 'Gestión de mantenimientos';
        case 'alertas': return 'Monitor de alertas';
        default: return 'SIGMATI';
    }
});

const servers = computed(() => monitoringStore.servers);

onMounted(() => {
    monitoringStore.fetchMonitoringData();
});

const handleLogout = () => {
    authStore.logout();
};
</script>
