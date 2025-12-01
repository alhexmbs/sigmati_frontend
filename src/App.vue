<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAlertasStore } from '@/stores/alertas';

const alertasStore = useAlertasStore();

onMounted(() => {
  // Inicializar la conexión WebSocket globalmente
  alertasStore.connectWebSocket();
});
</script>
