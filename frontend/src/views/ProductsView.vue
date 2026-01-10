<template>
    <div>
    <h1>Products</h1>

    <form @submit.prevent="addProduct">
        <input
            type="text"
            placeholder="Name"
            v-model="newName"
        />

        <input
            type="number"
            placeholder="Price"
            v-model="newPrice"
        />

        <button type="submit">
            Add product
        </button>
    </form>

    <button @click="loadProducts">
        Load products
    </button>

    <p v-if="error">{{ error }}</p>
    
    <ul>
        <li v-for="product in products" :key="product.id">
            {{ product.name }} - {{ product.price }}
        </li>
    </ul>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { auth } from "../firebase/firebase"

const products = ref([])
const error = ref("")
const newName = ref("")
const newPrice = ref("")

const loadProducts = async () => {
  error.value = ""

  try {
    const token = await auth.currentUser.getIdToken()

    const res = await fetch("http://localhost:5000/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    products.value = await res.json()
  } catch (err) {
    error.value = err.message
  }
}

const addProduct = async () => {
  error.value = ""

  try {
    const token = await auth.currentUser.getIdToken()

    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName.value,
        price: Number(newPrice.value)
      })
    })

    if (!res.ok) {
      throw new Error("Failed to add product")
    }

    newName.value = ""
    newPrice.value = ""

    await loadProducts()
  } catch (err) {
    error.value = err.message
  }
}
</script>
