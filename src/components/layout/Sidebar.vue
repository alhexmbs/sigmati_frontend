<template>
    <aside class="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50">
        <div class="p-6 flex items-center gap-3 border-b border-slate-800">
            <div class="bg-amber-600 p-2 rounded-lg">
                <Activity class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-xl font-bold tracking-tight">SIGMATI</h1>
        </div>

        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group" :class="[
                    $route.path === item.path
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                ]">
                <component :is="item.icon" class="w-5 h-5" />
                <span class="font-medium">{{ item.name }}</span>
            </router-link>
        </nav>

        <div class="p-4 border-t border-slate-800">
            <div class="flex items-center gap-3 px-4 py-3">
                <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <User class="w-4 h-4 text-slate-300" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">{{ user?.nombre || 'Usuario' }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ user?.rol || 'Admin' }}</p>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
    LayoutDashboard,
    Wrench,
    Bell,
    Activity,
    User,
    MonitorPlay
} from 'lucide-vue-next';

const route = useRoute();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Mantenimientos', path: '/mantenimientos', icon: Wrench },
    { name: 'Alertas', path: '/alertas', icon: Bell },
    { name: 'Simulador', path: '/simulador', icon: MonitorPlay },
];
</script>
