import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({ baseURL })

// Attaches the JWT (once Day 4 stores one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('deskflow.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
