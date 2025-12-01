<template>
    <div class="min-h-screen bg-slate-100 font-sans">
        <!-- Mobile Overlay -->
        <div v-if="isSidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>

        <Sidebar :isOpen="isSidebarOpen" @close="closeSidebar" />
        <Navbar @toggle-sidebar="toggleSidebar" />
        
        <main class="transition-all duration-300 ease-in-out p-4 md:p-8 md:ml-64">
            <slot></slot>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
    isSidebarOpen.value = false;
};
</script>
