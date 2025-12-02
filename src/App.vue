<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useAlertasStore } from '@/stores/alertas';

const alertasStore = useAlertasStore();

const handleInteraction = () => {
  alertasStore.unlockAudio();
  // Removemos el listener para que no se ejecute en cada clic
  window.removeEventListener('click', handleInteraction);
  window.removeEventListener('keydown', handleInteraction);
};

onMounted(() => {
  // Inicializar la conexión WebSocket globalmente
  alertasStore.connectWebSocket();

  // Escuchamos la primera interacción del usuario
  window.addEventListener('click', handleInteraction);
  window.addEventListener('keydown', handleInteraction);
});

onUnmounted(() => {
  // Limpieza por si acaso
  window.removeEventListener('click', handleInteraction);
  window.removeEventListener('keydown', handleInteraction);
});
</script>
