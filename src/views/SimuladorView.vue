<template>
    <MainLayout>
        <h1 class="text-2xl font-bold text-slate-900 mb-6">Simulador de fallas</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card v-for="activo in activos" :key="activo.id">
                <div class="flex items-center gap-4 mb-4">
                    <div class="p-3 bg-slate-100 rounded-lg">
                        <Server class="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h3 class="font-semibold text-slate-900">{{ activo.nombre }}</h3>
                        <p class="text-sm text-slate-500">{{ activo.ip }}</p>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <Button variant="danger" @click="simularFalla(activo.id)" :disabled="loading"
                        class="w-full flex items-center justify-center gap-2">
                        <AlertTriangle class="w-4 h-4" />
                        Simular caída
                    </Button>

                    <Button variant="primary"
                        class="w-full flex items-center justify-center gap-2 !bg-green-600 hover:!bg-green-700"
                        @click="simularRecuperacion(activo.id)" :disabled="loading">
                        <CheckCircle class="w-4 h-4" />
                        Simular recuperación
                    </Button>
                </div>
            </Card>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { useAlertasStore } from '@/stores/alertas';
import { useResourcesStore } from '@/stores/resources';
import { Server, AlertTriangle, CheckCircle } from 'lucide-vue-next';

const store = useAlertasStore();
const resourcesStore = useResourcesStore();
const loading = ref(false);

const activos = computed(() => resourcesStore.activos);

onMounted(() => {
    resourcesStore.fetchActivos();
});

const simularFalla = async (id) => {
    loading.value = true;
    try {
        await store.simularFalla(id);
        // Show success toast (optional)
    } catch (error) {
        console.error('Error simulando falla:', error);
    } finally {
        loading.value = false;
    }
};

const simularRecuperacion = async (id) => {
    loading.value = true;
    try {
        await store.simularRecuperacion(id);
        // Show success toast (optional)
    } catch (error) {
        console.error('Error simulando recuperación:', error);
    } finally {
        loading.value = false;
    }
};
</script>
