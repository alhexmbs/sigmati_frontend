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

        <!-- KPIs de Mantenimiento -->
        <div class="mb-8">
            <h2 class="text-xl font-bold text-slate-800 mb-4">KPIs de mantenimientos</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Cumplimiento Preventivo -->
                <Card class="flex flex-col items-center justify-center p-6">
                    <h3 class="text-lg font-semibold text-slate-700 mb-4">Cumplimiento preventivo</h3>
                    <div class="w-48 h-48 relative mb-4">
                        <Doughnut :data="cumplimientoData" :options="percentageOptions" />
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span class="text-2xl font-bold text-slate-800">{{ graficos?.kpis?.cumplimientoPreventivo ||
                                '0' }}%</span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-500 text-center px-4">
                        Porcentaje de mantenimientos preventivos completados vs. programados.
                    </p>
                </Card>

                <!-- Evidencia Registrada -->
                <Card class="flex flex-col items-center justify-center p-6">
                    <h3 class="text-lg font-semibold text-slate-700 mb-4">Evidencia registrada</h3>
                    <div class="w-48 h-48 relative mb-4">
                        <Doughnut :data="evidenciaData" :options="percentageOptions" />
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span class="text-2xl font-bold text-slate-800">{{ graficos?.kpis?.evidenciaRegistrada ||
                                '0' }}%</span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-500 text-center px-4">
                        Porcentaje de mantenimientos finalizados que cuentan con evidencia fotográfica.
                    </p>
                </Card>

                <!-- Preventivos por Servicio -->
                <Card class="col-span-1 md:col-span-1 lg:col-span-1 p-6">
                    <h3 class="text-lg font-semibold text-slate-700 mb-4">Preventivos por servicio (mes)</h3>
                    <div class="h-64 mb-4">
                        <Bar :data="preventivosData" :options="barOptions" />
                    </div>
                    <p class="text-xs text-slate-500 text-center">
                        Cantidad de mantenimientos preventivos realizados por servicio durante el mes actual.
                    </p>
                </Card>
            </div>
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
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const store = useDashboardStore();
// Usamos un objeto vacío por defecto para evitar errores si el store devuelve undefined
const resumen = computed(() => store.resumen || {});
const graficos = computed(() => store.graficos || {});

// Configuración de datos para gráficos
const cumplimientoData = computed(() => {
    const valor = parseFloat(graficos.value?.kpis?.cumplimientoPreventivo || 0);
    return {
        labels: ['Cumplido', 'Pendiente'],
        datasets: [{
            backgroundColor: ['#10B981', '#E2E8F0'],
            data: [valor, 100 - valor]
        }]
    };
});

const evidenciaData = computed(() => {
    const valor = parseFloat(graficos.value?.kpis?.evidenciaRegistrada || 0);
    return {
        labels: ['Con Evidencia', 'Sin Evidencia'],
        datasets: [{
            backgroundColor: ['#3B82F6', '#E2E8F0'],
            data: [valor, 100 - valor]
        }]
    };
});

const preventivosData = computed(() => {
    const data = graficos.value?.kpis?.preventivosPorServicio || [];
    return {
        labels: data.map(item => item.servicio),
        datasets: [{
            label: 'Mantenimientos Preventivos',
            backgroundColor: '#6366F1',
            data: data.map(item => parseInt(item.cantidad))
        }]
    };
});

const percentageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
    }
};

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
        }
    }
};

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
        iconBg: 'bg-accent/10',
        iconColor: 'text-accent'
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