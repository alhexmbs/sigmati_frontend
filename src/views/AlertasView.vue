<template>
    <MainLayout>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-slate-900">Monitor de alertas</h1>
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
                <div v-for="alerta in alertas" :key="alerta.id || alerta.timestamp"
                    class="bg-white p-4 rounded-lg shadow-sm border-l-4 flex items-start justify-between transition-all duration-300"
                    :class="getAlertClass(alerta.nivel)">
                    <div class="flex items-start gap-4">
                        <div :class="getIconBgClass(alerta.nivel)" class="p-2 rounded-lg">
                            <AlertTriangle v-if="alerta.nivel === 'CRITICAL'" class="w-6 h-6 text-red-600" />
                            <Info v-else class="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-slate-900">{{ alerta.mensaje }}</h3>
                            <p class="text-sm text-slate-500 mt-1">Activo: {{ getActivoName(alerta.id_activo) }}</p>
                            <p class="text-xs text-slate-400 mt-2">{{ new Date(alerta.timestamp).toLocaleString() }}</p>
                        </div>
                    </div>
                    <span :class="getBadgeClass(alerta.nivel)"
                        class="px-2.5 py-0.5 rounded-full text-xs font-medium border">
                        {{ alerta.nivel }}
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
import { AlertTriangle, Info, BellOff } from 'lucide-vue-next';

const store = useAlertasStore();
const resourcesStore = useResourcesStore();

const alertas = computed(() => store.alertas);
const connected = computed(() => store.connected);
const activos = computed(() => resourcesStore.activos);

onMounted(() => {
    store.fetchAlertas();
    resourcesStore.fetchActivos();
});

const getActivoName = (id) => {
    const activo = activos.value.find(a => a.id === id);
    return activo ? activo.nombre : `ID: ${id}`;
};

const getAlertClass = (nivel) => {
    switch (nivel) {
        case 'CRITICAL': return 'border-l-red-500';
        case 'WARNING': return 'border-l-amber-500';
        default: return 'border-l-blue-500';
    }
};

const getIconBgClass = (nivel) => {
    switch (nivel) {
        case 'CRITICAL': return 'bg-red-50';
        case 'WARNING': return 'bg-amber-50';
        default: return 'bg-blue-50';
    }
};

const getBadgeClass = (nivel) => {
    switch (nivel) {
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
