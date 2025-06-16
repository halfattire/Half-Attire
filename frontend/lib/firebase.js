import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCU-0pQEziP7mlAbxhlaNw9OjKsFeMn4-Y",
  authDomain: "half-attire.firebaseapp.com",
  projectId: "half-attire",
  storageBucket: "half-attire.firebasestorage.app",
  messagingSenderId: "214388044899",
  appId: "1:214388044899:web:979bc37a48ff08fa44b456",
  measurementId: "G-49C211SZGF",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
