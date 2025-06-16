import axios from "axios"
import { server } from "./server"

// Create an axios instance with default config
const api = axios.create({
  baseURL: server,
  withCredentials: true, // Always include credentials
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token from localStorage if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const userData = localStorage.getItem("userData")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      console.log("Authentication error - redirecting to login")
      // You could redirect to login page or refresh token here
    }
    return Promise.reject(error)
  },
)

export default api
