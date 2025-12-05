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
                    <button @click="downloadPDF"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        title="Descargar PDF">
                        <FileDown class="w-4 h-4" />
                        <span class="hidden md:inline">PDF</span>
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
                <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-slate-800">Activos con mayor incidencia (Mantenimientos)</h3>
                    <span v-if="filters.fechaInicio || filters.fechaFin" class="text-sm text-slate-500">
                        Mostrando datos del {{ filters.fechaInicio || 'Inicio' }} al {{ filters.fechaFin || 'Actualidad'
                        }}
                    </span>
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
                                    Marca</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Modelo</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Cantidad de mantenimientos</th>
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
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {{ item.marca || 'N/A' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {{ item.modelo || 'N/A' }}
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

            <!-- Activos con mayor número de caídas (Critical) -->
            <Card class="overflow-hidden mt-8">
                <div class="p-6 border-b border-slate-100">
                    <h3 class="text-lg font-semibold text-slate-800">Activos con mayor número de caídas (Critical)</h3>
                    <p class="text-sm text-slate-500">Top 5 activos con más alertas críticas</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50 text-xs uppercase text-slate-500 font-medium">
                            <tr>
                                <th class="px-6 py-3 text-left tracking-wider">Nombre</th>
                                <th class="px-6 py-3 text-left tracking-wider">Marca</th>
                                <th class="px-6 py-3 text-left tracking-wider">Modelo</th>
                                <th class="px-6 py-3 text-right tracking-wider">Cantidad</th>
                                <th class="px-6 py-3 text-left tracking-wider w-1/3">Visualización</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(item, index) in reportesData.activosMasCaidas" :key="index"
                                class="hover:bg-slate-50/50">

                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="font-medium text-slate-900">{{ item.nombre }}</span>
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {{ item.marca || 'N/A' }}
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {{ item.modelo || 'N/A' }}
                                </td>

                                <td class="px-6 py-3 text-right whitespace-nowrap">
                                    <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                        {{ item.cantidad }}
                                    </span>
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap w-1/3">
                                    <div class="w-full bg-slate-100 rounded-full h-2">
                                        <div class="bg-red-500 h-2 rounded-full"
                                            :style="{ width: `${(parseInt(item.cantidad) / maxCriticalCount) * 100}%` }">
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
import { Filter, RotateCcw, Clock, Server, FileDown } from 'lucide-vue-next';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const maxCriticalCount = computed(() => {
    const data = reportesData.value.activosMasCaidas || [];
    if (data.length === 0) return 1;
    return Math.max(...data.map(item => parseInt(item.cantidad)));
});

const maxTiempoPerdido = computed(() => {
    const data = reportesData.value.tiempoPerdidoPorArea || [];
    if (data.length === 0) return 1;
    return Math.max(...data.map(item => parseFloat(item.horas_perdidas)));
});

const maxTiempoPerdidoActivo = computed(() => {
    const data = reportesData.value.activosMayorTiempoPerdido || [];
    if (data.length === 0) return 1;
    return Math.max(...data.map(item => parseFloat(item.horas_perdidas)));
});

const maxMttr = computed(() => {
    const data = reportesData.value.mttrPorArea || [];
    if (data.length === 0) return 1;
    return Math.max(...data.map(item => parseFloat(item.mttr_horas)));
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

const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Reporte de activos, servicios e incidencias', 14, 22);
    doc.setTextColor(40, 40, 40);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

    // Assuming activeDateFilter is derived from filters.value or a similar mechanism
    // If activeDateFilter is not defined elsewhere, you might need to define it or adapt this line.
    // For now, let's use the existing filters.value to construct the date range text.
    const dateRangeText = (filters.value.fechaInicio || filters.value.fechaFin)
        ? `Periodo: ${filters.value.fechaInicio || 'Inicio'} - ${filters.value.fechaFin || 'Actualidad'}`
        : '';
    if (dateRangeText) {
        doc.text(dateRangeText, 14, 36);
    }

    // Table 1: Mantenimientos
    autoTable(doc, {
        startY: 45,
        head: [['Activo', 'Marca', 'Modelo', 'Cantidad de mantenimientos']],
        body: reportesData.value.activosMasMantenimientos.map(item => [
            item.nombre,
            item.marca || '-',
            item.modelo || '-',
            item.cantidad
        ]),
        theme: 'grid',
        headStyles: { fillColor: [66, 133, 244] },
        styles: { fontSize: 9 }
    });

    // Table 2: Caídas (Critical)
    let finalY = doc.lastAutoTable.finalY || 50;
    doc.text('Caídas (Alertas críticas)', 14, finalY + 15);

    autoTable(doc, {
        startY: finalY + 20,
        head: [['Activo', 'Marca', 'Modelo', 'Cantidad']],
        body: reportesData.value.activosMasCaidas.map(item => [
            item.nombre,
            item.marca || '-',
            item.modelo || '-',
            item.cantidad
        ]),
        theme: 'grid',
        headStyles: { fillColor: [220, 53, 69] }, // Red
        styles: { fontSize: 9 }
    });

    // Table 3: Tiempo Perdido por Área
    finalY = doc.lastAutoTable.finalY;
    doc.text('Tiempo perdido por área', 14, finalY + 15);

    autoTable(doc, {
        startY: finalY + 20,
        head: [['Área', 'Horas perdidas']],
        body: reportesData.value.tiempoPerdidoPorArea.map(item => [
            item.nombre,
            `${item.horas_perdidas} h`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [255, 152, 0] }, // Orange
        styles: { fontSize: 9 }
    });

    // Table 4: Activos con Mayor Tiempo Perdido
    finalY = doc.lastAutoTable.finalY;
    doc.text('Activos con mayor tiempo perdido', 14, finalY + 15);

    autoTable(doc, {
        startY: finalY + 20,
        head: [['Activo', 'Marca', 'Modelo', 'Horas Perdidas']],
        body: reportesData.value.activosMayorTiempoPerdido.map(item => [
            item.nombre,
            item.marca || '-',
            item.modelo || '-',
            `${item.horas_perdidas} h`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [220, 53, 69] }, // Red
        styles: { fontSize: 9 }
    });

    // Table 5: MTTR por Área
    finalY = doc.lastAutoTable.finalY;
    doc.text('Tiempo promedio de reparación por área', 14, finalY + 15);

    autoTable(doc, {
        startY: finalY + 20,
        head: [['Área', 'Tiempo promedio de reparación (Horas)']],
        body: reportesData.value.mttrPorArea.map(item => [
            item.nombre,
            `${item.mttr_horas} h`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [33, 150, 243] }, // Blue
        styles: { fontSize: 9 }
    });

    doc.save('reporte-activos.pdf');
};

onMounted(() => {
    store.fetchReportesData();
});
</script>
