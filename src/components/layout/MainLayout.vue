<template>
    <div class="min-h-screen bg-slate-100 font-sans">
        <Sidebar />
        <Navbar />
        <main class="ml-64 p-8">
            <slot></slot>
        </main>
    </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
</script>
