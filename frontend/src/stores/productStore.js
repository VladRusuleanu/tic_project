import { defineStore } from 'pinia'
import axios from 'axios'
import { auth } from '../firebase/firebase'

const API_URL = 'http://localhost:5000/api/products'

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const user = auth.currentUser
        if (!user) throw new Error("User not authenticated")
        
        const token = await user.getIdToken()
        
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        this.products = response.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message
        console.error("Error fetching products:", err)
      } finally {
        this.loading = false
      }
    },

    async addProduct(productData) {
      this.loading = true
      try {
        const user = auth.currentUser
        if (!user) throw new Error("User not authenticated")
        const token = await user.getIdToken()

        const response = await axios.post(API_URL, productData, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.products.push(response.data)
      } catch (err) {
        this.error = err.response?.data?.error || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id, productData) {
      this.loading = true;
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        const token = await user.getIdToken();

        const response = await axios.put(`${API_URL}/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      try {
        const user = auth.currentUser
        if (!user) throw new Error("User not authenticated")
        const token = await user.getIdToken()

        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.products = this.products.filter(p => p.id !== id)
      } catch (err) {
        this.error = err.message
        console.error(err)
      }
    }
  }
})
