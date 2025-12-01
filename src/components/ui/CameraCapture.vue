<template>
    <div class="flex flex-col items-center gap-4">
        <div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video ref="video" v-show="!capturedImage" autoplay playsinline class="w-full h-full object-cover"></video>
            <canvas ref="canvas" class="hidden"></canvas>
            <img v-if="capturedImage" :src="capturedImage" class="w-full h-full object-cover" />

            <div v-if="!stream && !capturedImage" class="absolute inset-0 flex items-center justify-center text-white">
                <p>Cámara inactiva</p>
            </div>
        </div>

        <div class="flex gap-3">
            <Button v-if="!capturedImage" variant="primary" @click="capture" :disabled="!stream">
                <Camera class="w-4 h-4 mr-2 inline-block" />
                Capturar
            </Button>
            <Button v-else variant="secondary" @click="retake">
                <RefreshCw class="w-4 h-4 mr-2 inline-block" />
                Retomar
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Button from '@/components/ui/Button.vue';
import { Camera, RefreshCw } from 'lucide-vue-next';

const emit = defineEmits(['capture']);

const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const capturedImage = ref(null);

const startCamera = async () => {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video.value) {
            video.value.srcObject = stream.value;
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
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

const retake = () => {
    capturedImage.value = null;
    emit('capture', null);
};

onMounted(() => {
    startCamera();
});

onUnmounted(() => {
    stopCamera();
});
</script>
