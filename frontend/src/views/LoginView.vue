<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card width="400" class="pa-4" elevation="4">
      <v-card-title class="text-center text-h5 font-weight-bold text-primary">
        Welcome Back
      </v-card-title>
      <v-card-subtitle class="text-center mb-4">
        Login to manage your assets
      </v-card-subtitle>

      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field 
            v-model="email" 
            label="Email Address" 
            prepend-inner-icon="mdi-email" 
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          
          <v-text-field 
            v-model="password" 
            label="Password" 
            type="password" 
            prepend-inner-icon="mdi-lock" 
            variant="outlined"
            density="comfortable"
          ></v-text-field>

          <div class="d-flex justify-end mb-4">
            <a href="#" @click.prevent="forgotPasswordDialog = true" class="text-caption text-decoration-none text-primary">
              Forgot your password?
            </a>
          </div>
          
          <v-alert v-if="error" type="error" variant="tonal" class="mb-4" density="compact" closable @click:close="error = ''">
            {{ error }}
          </v-alert>
          
          <v-btn type="submit" color="primary" block size="large" :loading="loading">
            Login
          </v-btn>
        </v-form>

        <div class="text-center mt-5">
            <span class="text-grey">Don't have an account? </span>
            <router-link to="/register" class="text-primary font-weight-bold text-decoration-none">
              Sign Up
            </router-link>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="forgotPasswordDialog" max-width="400">
      <v-card>
        <v-card-title>Reset Password</v-card-title>
        <v-card-text>
          <p class="text-body-2 text-grey mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <v-text-field 
            v-model="resetEmail" 
            label="Email for reset" 
            variant="outlined" 
            prepend-inner-icon="mdi-email-refresh"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="forgotPasswordDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="handleResetPassword">Send Email</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" color="success" timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const forgotPasswordDialog = ref(false);
const resetEmail = ref('');
const snackbar = ref(false);
const snackbarText = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/products'); 
  } catch (err) {
    if (err.message.includes('invalid-credential')) {
      error.value = "Incorrect email or password.";
    } else {
      error.value = err.message;
    }
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  try {
    const emailToSend = resetEmail.value || email.value;
    
    await authStore.resetPassword(emailToSend);
    
    forgotPasswordDialog.value = false;
    snackbarText.value = "Check your email for the reset link!";
    snackbar.value = true;
  } catch (err) {
    alert(err.message);
  }
};
</script>
