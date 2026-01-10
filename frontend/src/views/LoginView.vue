<template>
  <div>
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <div>
        <label>Email</label>
        <input type="email" v-model="email" />
      </div>

      <div>
        <label>Password</label>
        <input type="password" v-model="password" />
      </div>

      <button type="submit">Login</button>

      <p v-if="error">{{ error }}</p>

    </form>
  </div>
</template>

<script>
import { ref } from "vue"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebase"

export default {
  name: "LoginView",
  setup() {
    const email = ref("")
    const password = ref("")
    const error = ref("")

    const handleLogin = async () => {
      error.value = ""

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
      )
      
      const token = await userCredential.user.getIdToken()
      
      console.log("TOKEN:", token)

      await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: "Produs test",
          price: 123
        })
      });

      await fetch("http://localhost:5000/products/fhbHVRP4RCy2sct8KfQv", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
});


      } catch (err) {
        error.value = err.message
      }
    }

    return {
      email,
      password,
      error,
      handleLogin
    }
  }
}
</script>


