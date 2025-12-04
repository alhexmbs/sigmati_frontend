<template>
    <MainLayout>
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-slate-800 mb-2">Reportes y estadísticas</h1>
            <p class="text-slate-500">Visualización detallada del rendimiento de mantenimientos y activos</p>
        </div>

        <!-- Filtros -->
        <Card class="mb-8 p-6">
            <div class="flex flex-col md:flex-row items-end gap-4">
                <div class="w-full md:w-auto">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Fecha inicio</label>
                    <input type="date" v-model="filters.fechaInicio"
                        class="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" />
                </div>
                <div class="w-full md:w-auto">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Fecha fin</label>
                    <input type="date" v-model="filters.fechaFin"
                        class="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" />
                </div>
                <div class="flex gap-2 w-full md:w-auto">
                    <button @click="applyFilters"
                        class="flex-1 md:flex-none px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                        <Filter class="w-4 h-4" />
                        Aplicar filtros
                    </button>
                    <button @click="resetFilters"
                        class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Limpiar filtros">
                        <RotateCcw class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Card>

        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>

        <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg mb-8">
            {{ error }}
        </div>

        <div v-else class="space-y-8">
            <!-- Top Row: Areas Chart & Status Distribution -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Areas con más mantenimientos -->
                <Card class="lg:col-span-2 p-6">
                    <h3 class="text-lg font-semibold text-slate-800 mb-6">Áreas con más mantenimientos</h3>
                    <div class="h-80">
                        <Bar :data="areasChartData" :options="horizontalBarOptions" />
                    </div>
                </Card>

                <!-- Distribución de Estado -->
                <Card class="p-6">
                    <h3 class="text-lg font-semibold text-slate-800 mb-6">Estado de mantenimientos</h3>
                    <div class="h-64 relative flex items-center justify-center">
                        <Doughnut :data="statusChartData" :options="doughnutOptions" />
                    </div>
                    <div class="mt-4 space-y-2">
                        <div v-for="(item, index) in reportesData.distribucionEstado" :key="index"
                            class="flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full"
                                    :style="{ backgroundColor: statusColors[index % statusColors.length] }"></div>
                                <span class="text-slate-600">{{ item.estado }}</span>
                            </div>
                            <span class="font-medium text-slate-900">{{ item.cantidad }}</span>
                        </div>
                    </div>
                </Card>
            </div>

            <!-- Middle Row: Average Time Cards -->
            <div>
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Tiempo promedio de resolución</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card v-for="(item, index) in reportesData.tiempoPromedioPorTipo" :key="index"
                        class="p-6 border-l-4" :class="index === 0 ? 'border-l-blue-500' : 'border-l-orange-500'">
                        <div class="flex items-start justify-between mb-2">
                            <span class="text-slate-500 font-medium">{{ item.nombre }}</span>
                            <Clock class="w-5 h-5 text-slate-400" />
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-bold text-slate-900">{{ item.horas_promedio }}</span>
                            <span class="text-sm text-slate-500">horas</span>
                        </div>
                    </Card>
                </div>
            </div>

            <!-- Bottom Row: Top Assets Table -->
            <Card class="overflow-hidden">
                <div class="p-6 border-b border-slate-100">
                    <h3 class="text-lg font-semibold text-slate-800">Activos con mayor incidencia</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Activo</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Cantidad de Mantenimientos</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Barra</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-slate-100">
                            <tr v-for="(item, index) in reportesData.activosMasMantenimientos" :key="index"
                                class="hover:bg-slate-50/50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-slate-100 rounded-lg">
                                            <Server class="w-4 h-4 text-slate-600" />
                                        </div>
                                        <span class="font-medium text-slate-900">{{ item.nombre }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                        {{ item.cantidad }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap w-1/3">
                                    <div class="w-full bg-slate-100 rounded-full h-2">
                                        <div class="bg-accent h-2 rounded-full"
                                            :style="{ width: `${(parseInt(item.cantidad) / maxAssetCount) * 100}%` }">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    </MainLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import Card from '@/components/ui/Card.vue';
import { useReportesStore } from '@/stores/reportes';
import { Filter, RotateCcw, Clock, Server } from 'lucide-vue-next';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const store = useReportesStore();
const filters = ref({
    fechaInicio: '',
    fechaFin: ''
});

const reportesData = computed(() => store.reportesData);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const statusColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6366F1'];

const areasChartData = computed(() => {
    const data = reportesData.value.areasMasMantenimientos || [];
    return {
        labels: data.map(item => item.nombre),
        datasets: [{
            label: 'Mantenimientos',
            backgroundColor: '#F59E0B',
            borderRadius: 6,
            data: data.map(item => parseInt(item.cantidad))
        }]
    };
});

const statusChartData = computed(() => {
    const data = reportesData.value.distribucionEstado || [];
    return {
        labels: data.map(item => item.estado),
        datasets: [{
            backgroundColor: statusColors,
            borderWidth: 0,
            data: data.map(item => parseInt(item.cantidad))
        }]
    };
});

const maxAssetCount = computed(() => {
    const data = reportesData.value.activosMasMantenimientos || [];
    if (data.length === 0) return 1;
    return Math.max(...data.map(item => parseInt(item.cantidad)));
});

const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1E293B',
            padding: 12,
            cornerRadius: 8
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { stepSize: 1 }
        },
        y: {
            grid: { display: false }
        }
    }
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
        legend: { display: false }
    }
};

const applyFilters = () => {
    store.setFilters(filters.value);
};

const resetFilters = () => {
    filters.value = { fechaInicio: '', fechaFin: '' };
    store.resetFilters();
};

onMounted(() => {
    store.fetchReportesData();
});
</script>
