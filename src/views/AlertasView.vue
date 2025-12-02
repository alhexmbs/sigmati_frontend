<template>
    <MainLayout>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 class="text-2xl font-bold text-slate-900">Monitor de alertas</h1>
            <a href="http://69.62.99.107/zabbix/zabbix.php?action=dashboard.view&dashboardid=1&from=now-1h&to=now"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-accent text-sidebar rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-sm">
                <span>Ir al tablero Zabbix</span>
                <ExternalLink class="w-4 h-4" />
            </a>
            <div class="flex items-center gap-2">
                <span class="relative flex h-3 w-3">
                    <span v-if="connected"
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span :class="connected ? 'bg-green-500' : 'bg-red-500'"
                        class="relative inline-flex rounded-full h-3 w-3"></span>
                </span>
                <span class="text-sm text-slate-500">{{ connected ? 'Conectado en tiempo real' : 'Desconectado'
                }}</span>
            </div>
        </div>

        <div class="space-y-4">
            <transition-group name="list">
                <div v-for="alerta in alertas" :key="alerta.id_alerta || alerta.fecha"
                    class="bg-white p-4 rounded-lg shadow-sm border-l-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300"
                    :class="getAlertClass(alerta.severidad)">
                    <div class="flex items-start gap-4">
                        <div :class="getIconBgClass(alerta.severidad)" class="p-2 rounded-lg shrink-0">
                            <AlertTriangle v-if="alerta.severidad === 'CRITICAL'" class="w-6 h-6 text-red-600" />
                            <Info v-else class="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-slate-900">{{ alerta.mensaje }}</h3>
                            <p class="text-sm text-slate-500 mt-1">
                                Activo: {{ alerta.id_activo ? getActivoName(alerta.id_activo) : 'General / Servicio externo' }}
                            </p>
                            <p class="text-xs text-slate-400 mt-2">{{ new Date(alerta.fecha).toLocaleString() }}</p>
                        </div>
                    </div>
                    <span :class="getBadgeClass(alerta.severidad)"
                        class="px-2.5 py-0.5 rounded-full text-xs font-medium border self-start md:self-center">
                        {{ alerta.severidad }}
                    </span>
                </div>
            </transition-group>

            <div v-if="alertas.length === 0"
                class="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                <BellOff class="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay alertas recientes</p>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import { useAlertasStore } from '@/stores/alertas';
import { useResourcesStore } from '@/stores/resources';
import { AlertTriangle, Info, BellOff, ExternalLink } from 'lucide-vue-next';

const store = useAlertasStore();
const resourcesStore = useResourcesStore();

const alertas = computed(() => store.alertas);
const connected = computed(() => store.connected);
const activos = computed(() => resourcesStore.activos);

onMounted(() => {
    store.fetchAlertas();
    resourcesStore.fetchActivos();
});

const getActivoName = (id_activo) => {
    const activo = activos.value.find(a => a.id === id_activo);
    return activo ? activo.nombre : `ID: ${id_activo}`;
};

const getAlertClass = (severidad) => {
    switch (severidad) {
        case 'CRITICAL': return 'border-l-red-500';
        case 'WARNING': return 'border-l-amber-500';
        default: return 'border-l-blue-500';
    }
};

const getIconBgClass = (severidad) => {
    switch (severidad) {
        case 'CRITICAL': return 'bg-red-50';
        case 'WARNING': return 'bg-amber-50';
        default: return 'bg-blue-50';
    }
};

const getBadgeClass = (severidad) => {
    switch (severidad) {
        case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-100';
        case 'WARNING': return 'bg-amber-50 text-amber-700 border-amber-100';
        default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
