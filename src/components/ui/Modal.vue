<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4 md:p-0">
        <div class="relative w-full max-w-2xl max-h-full">
            <div class="relative bg-white rounded-xl shadow-2xl">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b border-slate-200 rounded-t">
                    <h3 class="text-xl font-semibold text-slate-900">
                        {{ title }}
                    </h3>
                    <button @click="$emit('close')" type="button"
                        class="text-slate-400 bg-transparent hover:bg-slate-100 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                        <X class="w-5 h-5" />
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Body -->
                <div class="p-4 md:p-5 space-y-4">
                    <slot></slot>
                </div>
                <!-- Footer -->
                <div v-if="$slots.footer" class="flex items-center p-4 md:p-5 border-t border-slate-200 rounded-b">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';

defineProps({
    isOpen: Boolean,
    title: String
});

defineEmits(['close']);
</script>
