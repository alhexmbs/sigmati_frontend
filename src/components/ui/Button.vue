<template>
    <button :class="[
        'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant],
        { 'opacity-50 cursor-not-allowed': disabled }
    ]" :disabled="disabled" @click="$emit('click')">
        <slot></slot>
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'action', 'danger'].includes(value)
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const variantClasses = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900',
    secondary: 'bg-transparent border border-slate-900 text-slate-900 hover:bg-slate-50 focus:ring-slate-900',
    action: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
};
</script>
