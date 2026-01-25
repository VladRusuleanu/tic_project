<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/authStore';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});
</script>
