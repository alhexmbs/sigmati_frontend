import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import MantenimientosView from '../views/MantenimientosView.vue'
import AlertasView from '../views/AlertasView.vue'
import SimuladorView from '../views/SimuladorView.vue'
import ReportesView from '../views/ReportesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mantenimientos',
      name: 'mantenimientos',
      component: MantenimientosView,
      meta: { requiresAuth: true }
    },
    {
      path: '/alertas',
      name: 'alertas',
      component: AlertasView,
      meta: { requiresAuth: true }
    },
    {
      path: '/simulador',
      name: 'simulador',
      component: SimuladorView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: ReportesView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router
