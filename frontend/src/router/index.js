import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProductsView from "../views/ProductsView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: "/products", name: "products", component: ProductsView }
  ]
})

export default router
