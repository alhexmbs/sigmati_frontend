<template>
    <MainLayout>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 mb-2">Monitoreo de servidores</h1>
                <p class="text-slate-500">Estado en tiempo real de la infraestructura</p>
            </div>

            <a href="http://69.62.99.107/zabbix/zabbix.php?action=dashboard.view&dashboardid=1&from=now-1h&to=now"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-accent text-sidebar rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-sm">
                <span>Ir al tablero Zabbix</span>
                <ExternalLink class="w-4 h-4" />
            </a>
            

            <Button variant="primary" @click="openModal">
                <Plus class="w-4 h-4 mr-2 inline-block" />
                Agregar punto de monitoreo
            </Button>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card v-for="server in servers" :key="server.id_activo"
                class="p-6 border-l-4 transition-all hover:shadow-md"
                :class="server.estado === 'Operativo' ? 'border-l-green-500' : 'border-l-red-500'">
                <div class="flex items-start justify-between mb-4">
                    <div class="p-3 rounded-lg"
                        :class="server.estado === 'Operativo' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
                        <Server class="w-6 h-6" />
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium"
                        :class="server.estado === 'Operativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                        {{ server.estado }}
                    </span>
                </div>

                <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ server.nombre }}</h3>

                <div class="space-y-2 mt-4">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Marca:</span>
                        <span class="font-medium text-slate-700">{{ server.marca || 'N/A' }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Modelo:</span>
                        <span class="font-medium text-slate-700">{{ server.modelo || 'N/A' }}</span>
                    </div>
                </div>
            </Card>
        </div>

        <!-- Create Server Modal -->
        <Modal :isOpen="isModalOpen" title="Agregar nuevo servidor" @close="closeModal">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <Input v-model="form.nombre" label="Nombre del servidor" placeholder="Ej: SRV-APP-01" required />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input v-model="form.marca" label="Marca" placeholder="Ej: Dell" />
                    <Input v-model="form.modelo" label="Modelo" placeholder="Ej: PowerEdge R740" />
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-slate-700">Área</label>
                    <select v-model="form.id_area"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        required>
                        <option value="" disabled>Seleccione un área</option>
                        <option v-for="area in areas" :key="area.id_area" :value="area.id_area">
                            {{ area.nombre }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-slate-700">Descripción</label>
                    <textarea v-model="form.descripcion"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        rows="3" placeholder="Descripción del servidor..."></textarea>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" type="button" @click="closeModal"
                        :disabled="isSubmitting">Cancelar</Button>
                    <Button variant="primary" type="submit" :disabled="isSubmitting">
                        <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2">
                        </div>
                        Crear servidor
                    </Button>
                </div>
            </form>
        </Modal>

        <!-- Success Modal -->
        <Modal :isOpen="showSuccessModal" title="Servidor creado exitosamente" @close="closeSuccessModal">
            <div class="text-center py-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle class="w-8 h-8 text-green-600" />
                </div>
                <h3 class="text-lg font-medium text-slate-900 mb-2">¡Servidor registrado!</h3>
                <p class="text-slate-600 mb-6">
                    El servidor se ha creado correctamente. Utiliza el siguiente ID para configurar la conexión en
                    Zabbix:
                </p>
                <div class="bg-slate-100 p-4 rounded-lg mb-6">
                    <p class="text-sm text-slate-500 mb-1">ID del Activo</p>
                    <p class="text-3xl font-bold text-slate-800">{{ createdServerId }}</p>
                </div>
                <Button variant="primary" @click="closeSuccessModal" class="w-full">Entendido</Button>
            </div>
        </Modal>
    </MainLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Modal from '@/components/ui/Modal.vue';
import { useMonitoringStore } from '@/stores/monitoring';
import { useResourcesStore } from '@/stores/resources';
import { Server, Plus, CheckCircle, ExternalLink } from 'lucide-vue-next';

const store = useMonitoringStore();
const resourcesStore = useResourcesStore();

const servers = computed(() => store.servers);
const loading = computed(() => store.loading);
const areas = computed(() => resourcesStore.areas);

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const createdServerId = ref(null);

const form = ref({
    nombre: '',
    marca: '',
    modelo: '',
    id_area: '',
    descripcion: '',
    tipo: 'SERVIDOR' // Default type
});

const openModal = () => {
    form.value = {
        nombre: '',
        marca: '',
        modelo: '',
        id_area: '',
        descripcion: '',
        tipo: 'SERVIDOR'
    };
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const closeSuccessModal = () => {
    showSuccessModal.value = false;
    createdServerId.value = null;
};

const handleSubmit = async () => {
    if (!form.value.nombre || !form.value.id_area) {
        alert('Por favor complete los campos obligatorios');
        return;
    }

    isSubmitting.value = true;
    try {
        const response = await store.createServer(form.value);
        // Assuming response structure: { success: true, data: { id_activo: 123, ... }, message: "..." }
        if (response && response.data && response.data.id_activo) {
            createdServerId.value = response.data.id_activo;
            closeModal();
            showSuccessModal.value = true;
        } else {
            alert('Servidor creado, pero no se pudo obtener el ID.');
            closeModal();
        }
    } catch (error) {
        console.error('Error creating server:', error);
        alert('Error al crear el servidor');
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    await Promise.all([
        store.fetchMonitoringData(),
        resourcesStore.fetchAreas() // Ensure areas are loaded
    ]);
});
</script>
