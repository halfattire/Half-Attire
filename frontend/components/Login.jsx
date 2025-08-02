"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { server } from "../lib/server"
import { toast } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { FaArrowLeftLong } from "react-icons/fa6"
import { loadUserSuccess } from "../redux/reducers/user"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../lib/firebase"
import LoadingButton from "./LoadingButton"

export default function Login() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.user)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        dispatch(loadUserSuccess(parsedUserData))
      } catch (error) {
        localStorage.removeItem("userData")
      }
    }

    const savedEmail = localStorage.getItem("rememberedEmail")
    const savedPassword = localStorage.getItem("rememberedPassword")
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [dispatch])

  if (isAuthenticated) {
    router.push("/")
    return null
  }

  const handleGoogleClick = async () => {
    try {
      setGoogleLoading(true)

      // Try popup first, fallback to redirect if needed
      let result
      try {
        result = await signInWithPopup(auth, googleProvider)
      } catch (popupError) {
        console.log("Popup failed, trying redirect method:", popupError)
        // If popup fails, you could implement redirect method here
        throw popupError
      }

      // Ensure we have email from the user object
      const userEmail = result.user.email || result.user.providerData?.[0]?.email
      const userName = result.user.displayName || result.user.providerData?.[0]?.displayName
      const userPhoto = result.user.photoURL || result.user.providerData?.[0]?.photoURL

      const userData = {
        name: userName || userEmail?.split("@")[0] || "User",
        email: userEmail,
        photo: userPhoto,
      }

      if (!userData.email) {
        console.error("No email found in user data")
        toast.error("Unable to get email from Google account. Please try again or use a different account.")
        return
      }

      const res = await axios.post(`${server}/user/google`, userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })

      if (res.data.success) {
        console.log("Google login successful, received token:", res.data.token ? "Yes" : "No");
        
        // Store authentication data using the persistence service
        if (res.data.user) {
          localStorage.setItem("userData", JSON.stringify(res.data.user))
          console.log("Stored userData from Google login in localStorage");
        }
        
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          console.log("Stored token from Google login in localStorage:", res.data.token.substring(0, 20) + "...");
        } else {
          console.error("No token received from Google login backend!");
        }

        dispatch(loadUserSuccess(res.data.user))
        toast.success("Successfully signed in with Google!")
        router.push("/")
      } else {
        toast.error(res.data.message || "Authentication failed")
      }
    } catch (error) {
      console.error("Could not sign in with Google", error)
      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled")
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups for this site and try again.")
      } else if (error.response) {
        console.error("Server response:", error.response.data)
        toast.error(error.response.data?.message || "Server error")
      } else {
        toast.error("Google sign-in failed. Please try again.")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(`${server}/user/login`, { email, password, rememberMe }, { withCredentials: true })

      if (res.data.success) {
        console.log("Login successful, received token:", res.data.token ? "Yes" : "No");
        
        // Store authentication data using the persistence service
        if (res.data.user) {
          localStorage.setItem("userData", JSON.stringify(res.data.user))
          console.log("Stored userData in localStorage");
        }
        
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          console.log("Stored token in localStorage:", res.data.token.substring(0, 20) + "...");
        } else {
          console.error("No token received from backend!");
        }

        dispatch(loadUserSuccess(res.data.user))

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email)
          localStorage.setItem("rememberedPassword", password)
        } else {
          localStorage.removeItem("rememberedEmail")
          localStorage.removeItem("rememberedPassword")
        }

        toast.success("User successfully logged in")
        router.push("/")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("An error occurred. Please try again.")
      }
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Link href="/">
        <span className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors">
          <FaArrowLeftLong size={18} />
        </span>
      </Link>

      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white shadow-xl border-0 overflow-hidden dark:bg-gray-800 dark:shadow-2xl">
            <div className="px-8 py-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to your account to continue
                </p>
              </div>

              <LoadingButton
                onClick={handleGoogleClick}
                loading={googleLoading}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 mb-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <FcGoogle className="h-5 w-5 mr-3" />
                Continue with Google
              </LoadingButton>

              <div className="flex items-center mb-6">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
                <div className="px-4 text-gray-500 text-sm dark:text-gray-400 font-medium">or</div>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
                      disabled={loading}
                    >
                      {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      disabled={loading}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                </div>

                <LoadingButton 
                  type="submit" 
                  loading={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign in
                </LoadingButton>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      Create account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
