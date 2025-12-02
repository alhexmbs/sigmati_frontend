<template>
  <Transition name="slide-fade">
    <div v-if="alerta" 
         class="fixed top-4 right-4 z-50 w-full max-w-md bg-white border-l-4 border-red-500 rounded-lg shadow-2xl p-4 md:max-w-lg cursor-pointer hover:bg-slate-50 transition-colors"
         role="alert"
         @click="irAAlertas">
      
      <div class="flex items-start gap-3">
        <div class="shrink-0 text-red-500 bg-red-100 p-2 rounded-full animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="flex-1">
          <h3 class="font-bold text-red-600 text-lg">¡ALERTA CRÍTICA DETECTADA!</h3>
          <p class="text-slate-700 font-medium mt-1">{{ alerta.mensaje }}</p>
          <p class="text-slate-500 text-sm mt-2">
            Servicio: <span class="font-semibold">{{ alerta.servicio || 'Desconocido' }}</span>
          </p>
          <p class="text-xs text-slate-400 mt-1">{{ new Date().toLocaleString() }}</p>
        </div>

        <button @click.stop="cerrar" class="text-slate-400 hover:text-slate-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAlertasStore } from '@/stores/alertas';

const store = useAlertasStore();
const router = useRouter();

// Conectamos directamente con el estado del store
const alerta = computed(() => store.alertaPopup);

const cerrar = () => {
  store.cerrarPopup();
};

const irAAlertas = () => {
  router.push('/alertas');
  cerrar();
};
</script>

<style scoped>
/* Animación de entrada/salida */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>