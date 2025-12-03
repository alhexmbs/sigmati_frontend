<template>
    <MainLayout>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 class="text-2xl font-bold text-slate-900">Gestión de mantenimientos</h1>
            <Button variant="primary" @click="openModal" class="w-full md:w-auto">
                <Plus class="w-4 h-4 mr-2 inline-block" />
                Nuevo mantenimiento
            </Button>
        </div>

        <Card class="overflow-hidden p-0">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-slate-500">
                    <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th scope="col" class="px-6 py-3">Título</th>
                            <th scope="col" class="px-6 py-3">Tipo</th>
                            <th scope="col" class="px-6 py-3">Prioridad</th>
                            <th scope="col" class="px-6 py-3">Estado</th>
                            <th scope="col" class="px-6 py-3">Fechas</th>
                            <th scope="col" class="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in mantenimientos" :key="item.id_mantenimiento"
                            class="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 font-medium text-slate-900">{{ item.titulo }}</td>
                            <td class="px-6 py-4">{{ item.tipo_mantenimiento?.nombre || 'General' }}</td>
                            <td class="px-6 py-4">
                                <span :class="getPrioridadClass(item.prioridad)"
                                    class="px-2.5 py-0.5 rounded-full text-xs font-medium border">
                                    {{ item.prioridad }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="getEstadoClass(item.estado)"
                                    class="px-2.5 py-0.5 rounded-full text-xs font-medium border">
                                    {{ item.estado }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col text-xs">
                                    <span>Inicio: {{ formatDate(item.fecha_inicio) }}</span>
                                    <span>Fin: {{ formatDate(item.fecha_fin) }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button @click="openDetailsModal(item)"
                                        class="text-slate-400 hover:text-blue-600 transition-colors"
                                        title="Ver detalles">
                                        <Eye class="w-4 h-4" />
                                    </button>
                                    <button v-if="item.estado !== 'Finalizado'" @click="openExtendModal(item)"
                                        class="text-slate-400 hover:text-indigo-600 transition-colors"
                                        title="Extender tiempo">
                                        <Clock class="w-4 h-4" />
                                    </button>
                                    <button v-if="item.estado !== 'Finalizado'" @click="openFinalizarModal(item)"
                                        class="text-slate-400 hover:text-green-600 transition-colors" title="Finalizar">
                                        <CheckCircle class="w-4 h-4" />
                                    </button>
                                    <button v-if="item.estado !== 'Finalizado'" @click="editMantenimiento(item)"
                                        class="text-slate-400 hover:text-accent transition-colors" title="Editar">
                                        <Edit2 class="w-4 h-4" />
                                    </button>
                                    <button v-if="item.estado !== 'Finalizado'"
                                        @click="deleteMantenimiento(item.id_mantenimiento)"
                                        class="text-slate-400 hover:text-red-600 transition-colors" title="Eliminar">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="mantenimientos.length === 0">
                            <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                                No hay mantenimientos registrados.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>

        <!-- Create/Edit Modal -->
        <Modal :isOpen="isModalOpen" :title="isEditing ? 'Editar mantenimiento' : 'Nuevo mantenimiento'"
            @close="closeModal">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <Input v-model="form.titulo" label="Título" placeholder="Ingrese el título del mantenimiento"
                    required />
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-slate-700">Descripción</label>
                    <textarea v-model="form.descripcion"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        rows="3"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input v-model="form.fecha_inicio" label="Fecha de inicio" type="datetime-local" :min="minDateTime"
                        required />
                    <Input v-if="!isEditing" v-model="form.fecha_fin" label="Fecha de fin estimada"
                        type="datetime-local" :min="form.fecha_inicio || minDateTime" required />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium text-slate-700">Prioridad</label>
                        <select v-model="form.prioridad"
                            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900">
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium text-slate-700">Tipo</label>
                        <select v-model="form.id_tipo_mantenimiento"
                            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900">
                            <option v-for="tipo in tiposMantenimiento" :key="tipo.id_tipo_mantenimiento"
                                :value="tipo.id_tipo_mantenimiento">
                                {{ tipo.nombre }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Checkboxes for Areas and Activos -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Left Column: Areas -->
                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium text-slate-700">Áreas afectadas</label>
                        <div class="mb-2">
                            <Input v-model="areaSearch" placeholder="Buscar área..." class="text-sm" />
                        </div>
                        <div class="h-48 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                            <div v-for="area in areas" :key="area.id_area" class="flex items-center gap-2 mb-1">
                                <input type="checkbox" :value="area.id_area" v-model="form.areas"
                                    :id="'area-' + area.id_area"
                                    class="rounded border-slate-300 text-slate-900 focus:ring-slate-900">
                                <label :for="'area-' + area.id_area"
                                    class="text-sm text-slate-700 cursor-pointer select-none">{{ area.nombre }}</label>
                            </div>
                            <div v-if="areas.length === 0" class="text-xs text-slate-400 italic text-center py-2">
                                No hay áreas disponibles
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Activos -->
                    <div class="flex flex-col gap-1">
                        <label class="text-sm font-medium text-slate-700">Activos afectados</label>
                        <div class="mb-2">
                            <select v-model="selectedAssetType"
                                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                                <option value="">Todos los tipos</option>
                                <option v-for="tipo in tiposActivos" :key="tipo" :value="tipo">
                                    {{ tipo }}
                                </option>
                            </select>
                        </div>
                        <div class="h-48 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                            <div v-if="resourcesStore.loading" class="flex justify-center py-4">
                                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                            </div>
                            <template v-else>
                                <div v-for="activo in filteredActivos" :key="activo.id_activo"
                                    class="flex items-center gap-2 mb-1">
                                    <input type="checkbox" :value="activo.id_activo" v-model="form.activos"
                                        :id="'activo-' + activo.id_activo"
                                        class="rounded border-slate-300 text-slate-900 focus:ring-slate-900">
                                    <label :for="'activo-' + activo.id_activo"
                                        class="text-sm text-slate-700 cursor-pointer select-none">
                                        {{ activo.nombre }} <span class="text-xs text-slate-400">({{ activo.tipo
                                        }})</span>
                                    </label>
                                </div>
                                <div v-if="filteredActivos.length === 0"
                                    class="text-xs text-slate-400 italic text-center py-2">
                                    {{ form.areas.length > 0 ? 'No hay activos para las áreas seleccionadas' :
                                        'Seleccione un área para ver activos' }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" type="button" @click="closeModal"
                        :disabled="isSubmitting">Cancelar</Button>
                    <Button variant="primary" type="submit" :disabled="isSubmitting || form.activos.length === 0"
                        class="flex items-center gap-2">
                        <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white">
                        </div>
                        {{ isSubmitting ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear') }}
                    </Button>
                </div>
            </form>
        </Modal>

        <!-- Finalize Modal -->
        <Modal :isOpen="isFinalizeModalOpen" title="Finalizar mantenimiento" @close="closeFinalizeModal">
            <form @submit.prevent="handleFinalize" class="space-y-4">
                <p class="text-sm text-slate-600">Completa la información para finalizar: <strong>{{
                    selectedMantenimiento?.titulo }}</strong></p>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-slate-700">Notas de resolución</label>
                    <textarea v-model="finalizeNotes"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        rows="3" placeholder="Describe cómo se resolvió el mantenimiento..." required></textarea>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-slate-700">Evidencia (Cámara)</label>
                    <CameraCapture @capture="handleCameraCapture" />
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" type="button" @click="closeFinalizeModal">Cancelar</Button>
                    <Button variant="primary" type="submit" :disabled="!finalizeFile">Finalizar</Button>
                </div>
            </form>
        </Modal>

        <!-- Extend Modal -->
        <Modal :isOpen="isExtendModalOpen" title="Extender mantenimiento" @close="closeExtendModal">
            <form @submit.prevent="handleExtend" class="space-y-4">
                <p class="text-sm text-slate-600">Extender tiempo para: <strong>{{ selectedMantenimiento?.titulo
                }}</strong></p>

                <Input v-model="extendForm.nueva_fecha_fin" label="Nueva fecha de finalización" type="datetime-local"
                    required />

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-slate-700">Motivo de extensión</label>
                    <textarea v-model="extendForm.motivo"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        rows="3" placeholder="Explica por qué se necesita más tiempo..." required></textarea>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" type="button" @click="closeExtendModal">Cancelar</Button>
                    <Button variant="primary" type="submit">Extender</Button>
                </div>
            </form>
        </Modal>

        <!-- Details/Traceability Modal -->
        <Modal :isOpen="isDetailsModalOpen" title="Detalles y trazabilidad" @close="closeDetailsModal">
            <div v-if="detailsLoading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
            <div v-else-if="maintenanceDetails" class="space-y-6">
                <!-- Header Info -->
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-slate-500">Título</p>
                        <p class="font-medium text-slate-900">{{ maintenanceDetails.titulo }}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Estado</p>
                        <span :class="getEstadoClass(maintenanceDetails.estado)"
                            class="px-2.5 py-0.5 rounded-full text-xs font-medium border inline-block mt-1">
                            {{ maintenanceDetails.estado }}
                        </span>
                    </div>
                    <div>
                        <p class="text-slate-500">Creado por</p>
                        <p class="font-medium text-slate-900">{{ maintenanceDetails.creador ||
                            'Desconocido' }}</p>
                        <p class="text-xs text-slate-400">{{ formatDate(maintenanceDetails.fecha_creacion) }}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Finalizado por</p>
                        <p class="font-medium text-slate-900">{{ maintenanceDetails.finalizador
                            || '-' }}</p>
                        <p class="text-xs text-slate-400">{{ formatDate(maintenanceDetails.fecha_fin_real) }}</p>
                    </div>
                </div>

                <!-- Affected Resources -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-50 p-3 rounded-lg">
                        <p class="text-xs font-medium text-slate-500 uppercase mb-2">Activos / Servicios</p>
                        <ul class="space-y-1">
                            <li v-for="activo in maintenanceDetails.activos" :key="activo.id_activo"
                                class="text-sm text-slate-700 flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                {{ activo.nombre }}
                            </li>
                            <li v-if="!maintenanceDetails.activos?.length" class="text-xs text-slate-400 italic">Ninguno
                            </li>
                        </ul>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-lg">
                        <p class="text-xs font-medium text-slate-500 uppercase mb-2">Áreas Afectadas</p>
                        <ul class="space-y-1">
                            <li v-for="area in maintenanceDetails.areas" :key="area.id_area"
                                class="text-sm text-slate-700 flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                {{ area.nombre }}
                            </li>
                            <li v-if="!maintenanceDetails.areas?.length" class="text-xs text-slate-400 italic">Ninguna
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Dates -->
                <div class="bg-slate-50 p-4 rounded-lg text-sm grid grid-cols-3 gap-4">
                    <div>
                        <p class="text-slate-500">Inicio</p>
                        <p class="font-medium">{{ formatDate(maintenanceDetails.fecha_inicio) }}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Fin estimado</p>
                        <p class="font-medium">{{ formatDate(maintenanceDetails.fecha_fin) }}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Fin real</p>
                        <p class="font-medium"
                            :class="{ 'text-green-600': maintenanceDetails.fecha_finalizacion_real }">{{
                                formatDate(maintenanceDetails.fecha_finalizacion_real) || '-' }}</p>
                    </div>
                </div>

                <!-- Evidence -->
                <div v-if="maintenanceDetails.url_img">
                    <p class="text-sm font-medium text-slate-700 mb-2">Evidencia</p>
                    <img :src="maintenanceDetails.url_img" alt="Evidencia"
                        class="w-full h-48 object-cover rounded-lg border border-slate-200" />
                </div>

                <!-- History Timeline (Mocked if not available in API yet, assuming structure) -->
                <div>
                    <p class="text-sm font-medium text-slate-700 mb-3">Historial de eventos</p>
                    <div class="relative border-l-2 border-slate-200 ml-3 space-y-4">
                        <div v-for="(event, index) in maintenanceDetails.historial || []" :key="index"
                            class="ml-4 relative">
                            <div
                                class="absolute -left-[21px] mt-1.5 w-3 h-3 rounded-full bg-slate-400 border-2 border-white">
                            </div>
                            <p class="text-sm font-medium text-slate-900">{{ event.accion }}</p>
                            <p class="text-xs text-slate-500">{{ event.responsable || event.usuario }} - {{
                                formatDate(event.fecha) }}</p>
                            <p v-if="event.notas" class="text-xs text-slate-600 mt-1 italic">"{{ event.notas }}"</p>
                        </div>
                        <div v-if="!maintenanceDetails.historial?.length" class="ml-4 text-sm text-slate-400 italic">
                            No hay historial disponible.
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Modal from '@/components/ui/Modal.vue';
import CameraCapture from '@/components/ui/CameraCapture.vue';
import { useMantenimientosStore } from '@/stores/mantenimientos';
import { useResourcesStore } from '@/stores/resources';
import { useAuthStore } from '@/stores/auth';
import { Plus, Edit2, Trash2, CheckCircle, Clock, Eye } from 'lucide-vue-next';

const store = useMantenimientosStore();
const resourcesStore = useResourcesStore();
const authStore = useAuthStore();

const mantenimientos = computed(() => store.mantenimientos);
const tiposMantenimiento = computed(() => resourcesStore.tiposMantenimiento);
const activos = computed(() => resourcesStore.activos);
const areas = computed(() => resourcesStore.areas);
const tiposActivos = computed(() => resourcesStore.tiposActivos);

const minDateTime = computed(() => {
    const now = new Date();
    // Adjust to local timezone ISO string
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
});

// Modal States
const isModalOpen = ref(false);
const isEditing = ref(false);
const isFinalizeModalOpen = ref(false);
const isExtendModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const isSubmitting = ref(false);

// Selected Item & Loading
const selectedMantenimiento = ref(null);
const maintenanceDetails = ref(null);
const detailsLoading = ref(false);

// Forms
const finalizeFile = ref(null);
const finalizeNotes = ref('');
const extendForm = ref({ nueva_fecha_fin: '', motivo: '' });

// Search & Filter States
const areaSearch = ref('');
const selectedAssetType = ref('');

const form = ref({
    id_mantenimiento: null,
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    prioridad: 'Media',
    id_tipo_mantenimiento: 1,
    id_usuario_creador: authStore.user?.id || 1,
    activos: [],
    areas: []
});

// Computed for filtered assets
const filteredActivos = computed(() => {
    if (!selectedAssetType.value) return activos.value;
    return activos.value.filter(a => a.tipo === selectedAssetType.value);
});

// Watchers
let searchTimeout;
watch(areaSearch, (newValue) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        resourcesStore.fetchAreas(newValue);
    }, 300); // Debounce search
});

watch(() => form.value.areas, async (newAreas) => {
    if (newAreas.length > 0) {
        await resourcesStore.fetchActivosForAreas(newAreas);
    } else {
        // If no areas selected, clear assets or fetch all? 
        // Based on user request "listen solamente los activos de esa áreas", clearing seems appropriate or showing empty.
        // However, if editing, we might need to fetch assets for existing areas.
        // Let's clear for now to enforce area selection.
        if (!isEditing.value) { // Only clear if not initializing edit
            resourcesStore.activos = [];
        }
    }
}, { deep: true });


onMounted(async () => {
    await Promise.all([
        store.fetchMantenimientos(),
        resourcesStore.fetchAll()
    ]);
});

// --- CRUD Modals ---
const openModal = () => {
    isEditing.value = false;
    resetForm();
    isModalOpen.value = true;
    resourcesStore.activos = []; // Clear assets initially
};

const closeModal = () => {
    isModalOpen.value = false;
};

const editMantenimiento = async (item) => {
    isEditing.value = true;

    // Fetch full details to ensure we have all areas and assets
    try {
        const fullDetails = await store.fetchMantenimientoById(item.id_mantenimiento);

        form.value = {
            ...fullDetails,
            fecha_inicio: fullDetails.fecha_inicio ? new Date(fullDetails.fecha_inicio).toISOString().slice(0, 16) : '',
            activos: fullDetails.activos?.map(a => a.id_activo) || [],
            areas: fullDetails.areas?.map(a => a.id_area) || []
        };

        // Pre-fetch assets for the selected areas so they appear in the list
        if (form.value.areas.length > 0) {
            await resourcesStore.fetchActivosForAreas(form.value.areas);
        }

        isModalOpen.value = true;
    } catch (error) {
        console.error('Error fetching maintenance details for edit:', error);
        alert('Error al cargar los detalles del mantenimiento.');
    }
};

const deleteMantenimiento = async (id) => {
    if (confirm('¿Estás seguro de eliminar este mantenimiento?')) {
        await store.deleteMantenimiento(id);
    }
};

const handleSubmit = async () => {
    const now = new Date();
    const fechaInicio = new Date(form.value.fecha_inicio);

    // Allow a small buffer (e.g., 1 minute) for "now" comparison to avoid frustration with seconds
    if (fechaInicio < new Date(now.getTime() - 60000)) {
        alert('La fecha de inicio no puede ser anterior al momento actual.');
        return;
    }

    if (form.value.activos.length === 0) {
        alert('Debe seleccionar al menos un activo.');
        return;
    }

    isSubmitting.value = true;
    try {
        if (isEditing.value) {
            await store.updateMantenimiento(form.value.id_mantenimiento, form.value);
        } else {
            await store.createMantenimiento(form.value);
        }
        closeModal();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Ocurrió un error al procesar la solicitud.');
    } finally {
        isSubmitting.value = false;
    }
};

// --- Finalize Modal ---
const openFinalizarModal = (item) => {
    selectedMantenimiento.value = item;
    finalizeFile.value = null;
    finalizeNotes.value = '';
    isFinalizeModalOpen.value = true;
};

const closeFinalizeModal = () => {
    isFinalizeModalOpen.value = false;
    selectedMantenimiento.value = null;
    finalizeFile.value = null;
};

const handleCameraCapture = (blob) => {
    finalizeFile.value = blob;
};

const handleFinalize = async () => {
    if (!selectedMantenimiento.value || !finalizeFile.value) return;

    const formData = new FormData();
    formData.append('imagen', finalizeFile.value, 'evidencia.png');
    formData.append('id_usuario_responsable', authStore.user?.id || 1);
    formData.append('notas_resolucion', finalizeNotes.value);

    await store.finalizarMantenimiento(selectedMantenimiento.value.id_mantenimiento, formData);
    closeFinalizeModal();
};

// --- Extend Modal ---
const openExtendModal = (item) => {
    selectedMantenimiento.value = item;
    extendForm.value = { nueva_fecha_fin: '', motivo: '' };
    isExtendModalOpen.value = true;
};

const closeExtendModal = () => {
    isExtendModalOpen.value = false;
    selectedMantenimiento.value = null;
};

const handleExtend = async () => {
    if (!selectedMantenimiento.value) return;

    await store.extenderMantenimiento(selectedMantenimiento.value.id_mantenimiento, {
        ...extendForm.value,
        id_usuario_responsable: authStore.user?.id || 1
    });
    closeExtendModal();
};

// --- Details Modal ---
const openDetailsModal = async (item) => {
    selectedMantenimiento.value = item;
    isDetailsModalOpen.value = true;
    detailsLoading.value = true;
    try {
        maintenanceDetails.value = await store.fetchMantenimientoById(item.id_mantenimiento);
        //console.log(maintenanceDetails.value);
    } catch (error) {
        console.error(error);
    } finally {
        detailsLoading.value = false;
    }
};

const closeDetailsModal = () => {
    isDetailsModalOpen.value = false;
    selectedMantenimiento.value = null;
    maintenanceDetails.value = null;
};

// --- Helpers ---
const resetForm = () => {
    form.value = {
        id_mantenimiento: null,
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        prioridad: 'Media',
        id_tipo_mantenimiento: tiposMantenimiento.value.length > 0 ? tiposMantenimiento.value[0].id_tipo_mantenimiento : 1,
        id_usuario_creador: authStore.user?.id || 1,
        activos: [],
        areas: []
    };
    areaSearch.value = '';
    selectedAssetType.value = '';
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
};

const getPrioridadClass = (prioridad) => {
    switch (prioridad) {
        case 'Alta': return 'bg-red-50 text-red-700 border-red-100';
        case 'Media': return 'bg-amber-50 text-amber-700 border-amber-100';
        default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
};

const getEstadoClass = (estado) => {
    switch (estado) {
        case 'Programado': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'En Curso': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Finalizado': return 'bg-green-50 text-green-700 border-green-100';
        case 'Cancelado': return 'bg-red-50 text-red-700 border-red-100';
        default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
};
</script>
