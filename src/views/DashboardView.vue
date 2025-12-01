<template>
    <MainLayout>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card v-for="(stat, index) in stats" :key="index" class="relative overflow-hidden">
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-500">{{ stat.label }}</p>
                        <p class="text-3xl font-bold text-slate-900 mt-2">{{ stat.value }}</p>
                    </div>
                    <div :class="['p-3 rounded-lg', stat.iconBg]">
                        <component :is="stat.icon" :class="['w-6 h-6', stat.iconColor]" />
                    </div>
                </div>
            </Card>
        </div>

        <!-- Charts Data Display -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card class="h-96 overflow-y-auto">
                <div class="flex items-center gap-2 mb-4">
                    <BarChart3 class="w-5 h-5 text-slate-500" />
                    <h3 class="font-semibold text-slate-700">Alertas por día</h3>
                </div>
                <div v-if="graficos?.alertasPorDia?.length > 0" class="space-y-2">
                    <div v-for="(item, index) in graficos.alertasPorDia" :key="index"
                        class="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span class="text-sm text-slate-600">{{ item.fecha }}</span>
                        <span class="font-bold text-slate-800">{{ item.cantidad }}</span>
                    </div>
                </div>
                <div v-else class="text-center text-slate-400 py-10">No hay datos disponibles</div>
            </Card>

            <Card class="h-96 overflow-y-auto">
                <div class="flex items-center gap-2 mb-4">
                    <PieChart class="w-5 h-5 text-slate-500" />
                    <h3 class="font-semibold text-slate-700">Mantenimientos por tipo</h3>
                </div>
                <div v-if="graficos?.mantenimientosPorTipo?.length > 0" class="space-y-2">
                    <div v-for="(item, index) in graficos.mantenimientosPorTipo" :key="index"
                        class="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span class="text-sm text-slate-600">{{ item.nombre }}</span>
                        <span class="font-bold text-slate-800">{{ item.cantidad }}</span>
                    </div>
                </div>
                <div v-else class="text-center text-slate-400 py-10">No hay datos disponibles</div>
            </Card>
        </div>
    </MainLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import Card from '@/components/ui/Card.vue';
import { useDashboardStore } from '@/stores/dashboard';
import { Server, AlertTriangle, Wrench, Bell, BarChart3, PieChart } from 'lucide-vue-next';

const store = useDashboardStore();
// Usamos un objeto vacío por defecto para evitar errores si el store devuelve undefined
const resumen = computed(() => store.resumen || {}); 
const graficos = computed(() => store.graficos || {});

// CORRECCIÓN: Usamos Optional Chaining (?.) y valores por defecto (|| 0)
const stats = computed(() => [
    { 
        label: 'Total de servicios', 
        value: resumen.value?.totalServicios || 0, // Si no existe, muestra 0
        icon: Server, 
        iconBg: 'bg-blue-50', 
        iconColor: 'text-blue-600' 
    },
    { 
        label: 'Servicios caídos', 
        value: resumen.value?.serviciosCaidos || 0, 
        icon: AlertTriangle, 
        iconBg: 'bg-red-50', 
        iconColor: 'text-red-600' 
    },
    { 
        label: 'Mantenimientos', 
        value: resumen.value?.mantenimientosPendientes || 0, 
        icon: Wrench, 
        iconBg: 'bg-amber-50', 
        iconColor: 'text-amber-600' 
    },
    { 
        label: 'Alertas hoy', 
        value: resumen.value?.alertasHoy || 0, 
        icon: Bell, 
        iconBg: 'bg-indigo-50', 
        iconColor: 'text-indigo-600' 
    },
]);

onMounted(() => {
    store.fetchDashboardData();
});
</script>