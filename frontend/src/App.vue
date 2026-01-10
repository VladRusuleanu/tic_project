<template>
  <div>
    <Navbar :user="user" :logout="logout" />
    <router-link to="/products">Products</router-link>
    <router-view />
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "./firebase/firebase"
import Navbar from "./components/Navbar.vue"

export default {
  name: "App",
  components: {
    Navbar
  },
  setup() {
    const user = ref(null)

    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
      })
    })

    const logout = async () => {
      await signOut(auth)
      user.value = null
    }

    return {
      user,
      logout
    }
  }
}
</script>

