import { defineStore } from 'pinia';
import { auth } from '../firebase/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail,
    deleteUser
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
  }),
  actions: {
    initAuth() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.loading = false;
      });
    },
    async login(email, password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async register(email, password, fullName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: fullName });
            this.user = { ...userCredential.user, displayName: fullName };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async resetPassword(email) {
        if (!email) throw new Error("Please enter your email address first.");
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            throw new Error(error.message);
        }
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
    
    async deleteAccount() {
        try {
            if (!auth.currentUser) throw new Error("No user logged in.");
            
            await deleteUser(auth.currentUser);
            
            this.user = null;
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                throw new Error("Security Check: Please log out and log in again before deleting your account.");
            }
            throw new Error(error.message);
        }
    }
  }
});
