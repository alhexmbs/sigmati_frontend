<template>
    <div class="flex flex-col gap-1">
        <label v-if="label" :for="id" class="text-sm font-medium text-slate-700">{{ label }}</label>
        <input :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
    </div>
</template>

<script setup>
defineProps({
    modelValue: [String, Number],
    label: String,
    id: String,
    type: {
        type: String,
        default: 'text'
    },
    placeholder: String
});

defineEmits(['update:modelValue']);
</script>
