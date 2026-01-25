<template>
  <v-app-bar color="primary" density="compact" elevation="2">
    <v-app-bar-title>
      <router-link to="/" class="d-flex align-center" style="text-decoration: none; color: white; cursor: pointer;">
        <v-icon icon="mdi-laptop-account" class="mr-2"></v-icon>
        <span class="font-weight-bold">IT Asset Manager</span>
      </router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <template v-if="authStore.user">
      <div class="d-flex align-center">
        
        <v-btn to="/products" prepend-icon="mdi-view-dashboard" variant="text" class="mr-1">
          Inventory
        </v-btn>

        <v-btn @click="profileDialog = true" variant="text" class="text-capitalize">
            <v-icon icon="mdi-account-circle" class="mr-2"></v-icon>
            <span class="d-none d-sm-block">{{ authStore.user.displayName || 'User' }}</span>
        </v-btn>
        
        <v-btn @click="logoutDialog = true" icon="mdi-logout" title="Logout" color="white"></v-btn>
      </div>
    </template>

    <template v-else>
      <v-btn to="/login" variant="text">Login</v-btn>
      <v-btn to="/register" variant="tonal" class="ml-2 bg-white text-primary">Register</v-btn>
    </template>

    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 pt-4 px-4">
          <v-icon icon="mdi-alert-circle-outline" color="warning" class="mr-2"></v-icon>
          Confirm Logout
        </v-card-title>
        <v-card-text class="pa-4">Are you sure you want to log out?</v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="logoutDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="confirmLogout">Yes, Log Out</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="profileDialog" max-width="500">
        <v-card>
            <v-card-title class="bg-primary text-white">
                My Profile
            </v-card-title>
            
            <v-card-text class="pa-4">
                <div class="d-flex align-center mb-4">
                    <v-avatar color="primary" size="64" variant="tonal" class="mr-4">
                        <span class="text-h4">{{ (authStore.user?.displayName || 'U')[0] }}</span>
                    </v-avatar>
                    <div>
                        <div class="text-h6">{{ authStore.user?.displayName }}</div>
                        <div class="text-body-2 text-grey">{{ authStore.user?.email }}</div>
                    </div>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="rounded border border-error pa-4 bg-red-lighten-5">
                    <div class="text-subtitle-2 text-red-darken-4 font-weight-bold mb-1">Danger Zone</div>
                    <p class="text-caption text-grey-darken-2 mb-3">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <v-btn 
                        color="red" 
                        variant="outlined" 
                        block 
                        prepend-icon="mdi-delete-forever"
                        @click="showDeleteConfirm = true"
                    >
                        Delete My Account
                    </v-btn>
                </div>
            </v-card-text>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="profileDialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteConfirm" max-width="400">
        <v-card>
            <v-card-title class="text-h6 text-red">Delete Account?</v-card-title>
            <v-card-text>
                This action is <strong>permanent</strong>. Are you absolutely sure?
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="showDeleteConfirm = false">Cancel</v-btn>
                <v-btn color="red" variant="flat" :loading="deleteLoading" @click="handleDeleteAccount">
                    Yes, Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logoutDialog = ref(false);
const profileDialog = ref(false);
const showDeleteConfirm = ref(false);
const deleteLoading = ref(false);

const confirmLogout = async () => {
  logoutDialog.value = false;
  await authStore.logout();
  router.push('/');
};

const handleDeleteAccount = async () => {
    deleteLoading.value = true;
    try {
        await authStore.deleteAccount();
        showDeleteConfirm.value = false;
        profileDialog.value = false;
        router.push('/');
        alert("Account deleted successfully.");
    } catch (error) {
        alert(error.message);
    } finally {
        deleteLoading.value = false;
    }
};
</script>
