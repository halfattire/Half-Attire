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
    <div>
      <Link href="/">
        <span className="absolute mx-6 my-4 flex h-8 w-12 items-center justify-center rounded-md bg-blue-500 p-2 text-white shadow-sm">
          <FaArrowLeftLong size={20} />
        </span>
      </Link>

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div className="mt-10 w-full max-w-sm mx-auto rounded-lg bg-white shadow md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>

              <LoadingButton
                onClick={handleGoogleClick}
                loading={googleLoading}
                variant="outline"
                className="w-full border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Continue with Google
              </LoadingButton>

              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <div className="px-3 text-gray-500 text-sm dark:text-gray-400">or</div>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="name@company.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="focus:outline-none"
                        disabled={loading}
                      >
                        {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        disabled={loading}
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>
                <LoadingButton type="submit" loading={loading} className="w-full">
                  Sign in
                </LoadingButton>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don&apos;t have an account yet?{" "}
                  <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
