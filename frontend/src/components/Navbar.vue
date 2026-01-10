<template>
  <nav>
    <router-link to="/">Home</router-link>

    <router-link v-if="!user" to="/login">
      Login
    </router-link>

    <button v-if="user" @click="logout">
      Logout
    </button>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    user: {
      type: Object,
      default: null
    },
    logout: {
      type: Function,
      required: true
    }
  }
}
</script>
