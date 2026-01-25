<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card width="400" class="pa-4">
      <v-card-title class="text-center">Create Account</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleRegister">
          
          <v-text-field 
            v-model="fullName" 
            label="Full Name" 
            prepend-inner-icon="mdi-account" 
            variant="outlined"
            class="mb-2"
            :rules="[v => !!v || 'Name is required']"
          ></v-text-field>

          <v-text-field 
            v-model="email" 
            label="Email" 
            prepend-inner-icon="mdi-email" 
            variant="outlined"
            class="mb-2"
          ></v-text-field>
          
          <v-text-field 
            v-model="password" 
            label="Password" 
            type="password" 
            prepend-inner-icon="mdi-lock" 
            variant="outlined"
          ></v-text-field>
          
          <v-alert v-if="error" type="error" class="mt-3" density="compact">{{ error }}</v-alert>
          
          <v-btn type="submit" color="primary" block class="mt-4" :loading="loading">Sign Up</v-btn>
        </v-form>
        
        <div class="text-center mt-4">
            <span class="text-grey">Already have an account? </span>
            <router-link to="/login" class="text-primary font-weight-bold" style="text-decoration: none;">Login</router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const fullName = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  if(!fullName.value || !email.value || !password.value) {
      error.value = "All fields are required";
      return;
  }

  error.value = '';
  loading.value = true;
  try {
    await authStore.register(email.value, password.value, fullName.value);
    router.push('/products');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
