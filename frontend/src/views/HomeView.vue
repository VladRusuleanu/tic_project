<template>
  <v-container class="fill-height">
    <v-row class="align-center justify-center">
      <v-col cols="12" md="8" class="text-center">
        <v-icon icon="mdi-server-network" size="100" color="primary" class="mb-4"></v-icon>
        <h1 class="text-h2 font-weight-bold text-primary mb-2">IT Asset Manager</h1>
        <p class="text-h5 text-grey-darken-1 mb-6">
          The professional solution for tracking hardware, assigning assets, and managing maintenance workflows.
        </p>
        
        <div class="d-flex justify-center gap-4">
          <v-btn 
            v-if="!authStore.user" 
            to="/register" 
            color="primary" 
            size="x-large" 
            prepend-icon="mdi-rocket-launch"
            elevation="4"
          >
            Get Started
          </v-btn>

          <v-btn 
            v-else 
            to="/products" 
            color="success" 
            size="x-large" 
            prepend-icon="mdi-view-dashboard"
          >
            Go to Dashboard
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
const authStore = useAuthStore();
</script>
