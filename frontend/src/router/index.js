import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { useAuthStore } from '../stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { 
      path: '/products', 
      name: 'products', 
      component: ProductsView,
      meta: { requiresAuth: true }
    },
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.loading) {
     const checkAuth = () => new Promise(resolve => {
        const interval = setInterval(() => {
           if (!authStore.loading) {
              clearInterval(interval);
              resolve();
           }
        }, 50);
     });
     await checkAuth();
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
