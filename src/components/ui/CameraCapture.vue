<template>
    <div class="flex flex-col items-center gap-4">
        <div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video ref="video" v-show="!capturedImage && stream" autoplay playsinline class="w-full h-full object-cover"></video>
            <canvas ref="canvas" class="hidden"></canvas>
            <img v-if="capturedImage" :src="capturedImage" class="w-full h-full object-cover" />

            <div v-if="!stream && !capturedImage" class="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-800 p-4 text-center">
                <CameraOff class="w-8 h-8 mb-2 opacity-50" />
                <p class="text-sm">Cámara no disponible o inactiva</p>
            </div>
        </div>

        <div class="flex flex-wrap justify-center gap-3 w-full">
            <!-- Web Camera Controls -->
            <template v-if="stream && !capturedImage">
                <Button variant="primary" @click="capture">
                    <Camera class="w-4 h-4 mr-2 inline-block" />
                    Capturar
                </Button>
            </template>

            <!-- Retake Control -->
            <Button v-if="capturedImage" variant="secondary" @click="retake">
                <RefreshCw class="w-4 h-4 mr-2 inline-block" />
                Retomar
            </Button>

            <!-- Native Camera/Upload Fallback (Always available as alternative) -->
            <div v-if="!capturedImage">
                <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    class="hidden" 
                    ref="fileInput" 
                    @change="handleFileChange" 
                />
                <Button variant="secondary" @click="triggerFileInput" type="button">
                    <Upload class="w-4 h-4 mr-2 inline-block" />
                    {{ stream ? 'Subir / Usar nativa' : 'Tomar foto / Subir' }}
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Button from '@/components/ui/Button.vue';
import { Camera, RefreshCw, Upload, CameraOff } from 'lucide-vue-next';

const emit = defineEmits(['capture']);

const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const capturedImage = ref(null);
const fileInput = ref(null);

const startCamera = async () => {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (video.value) {
            video.value.srcObject = stream.value;
        }
    } catch (error) {
        console.warn('Error accessing camera or permission denied:', error);
        // We don't error out, just show the fallback UI
    }
};

const stopCamera = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop());
        stream.value = null;
    }
};

const capture = () => {
    if (!video.value || !canvas.value) return;

    const context = canvas.value.getContext('2d');
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);

    capturedImage.value = canvas.value.toDataURL('image/png');

    canvas.value.toBlob((blob) => {
        emit('capture', blob);
    }, 'image/png');
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            capturedImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Emit blob
        emit('capture', file);
    }
};

const retake = () => {
    capturedImage.value = null;
    if (fileInput.value) fileInput.value.value = ''; // Reset input
    emit('capture', null);
    if (!stream.value) {
        startCamera();
    }
};

onMounted(() => {
    startCamera();
});

onUnmounted(() => {
    stopCamera();
});
</script>
