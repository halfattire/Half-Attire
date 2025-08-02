"use client"

import { useState, useEffect } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { RxAvatar } from "react-icons/rx"
import { FcGoogle } from "react-icons/fc"
import axios from "axios"
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

function Register() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.user)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Google Sign-In Function
  const handleGoogleClick = async () => {
    try {
      setGoogleLoading(true)
      // Try popup first, fallback to redirect if needed
      let result
      try {
        result = await signInWithPopup(auth, googleProvider)
      } catch (popupError) {
        // Popup failed, trying redirect method
        // If popup fails, you could implement redirect method here
        throw popupError
      }

      const user = result.user
      const idToken = await user.getIdToken()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      }

      const { data } = await axios.post(`${server}/user/google-auth`, { user }, config)

      if (data.success) {
        toast.success("Welcome!")
        dispatch(loadUserSuccess(data.user))
        router.push("/")
      } else {
        toast.error(data.message || "Google sign-in failed")
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error)

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in cancelled")
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups and try again.")
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to sign in with Google")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleFileInputChange = (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result)
        setAvatar(e.target.files[0])
      }
    }

    reader.readAsDataURL(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all required fields")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }

    const newForm = new FormData()

    newForm.append("name", name)
    newForm.append("email", email)
    newForm.append("password", password)
    newForm.append("file", avatar)

    setLoading(true)

    try {
      const { data } = await axios.post(`${server}/user/create-user`, newForm, config)
      toast.success(data.message)
      setName("")
      setEmail("")
      setPassword("")
      setAvatar("")
      setAvatarPreview("")
      // No redirect here, user needs to verify email first
    } catch (error) {
      console.error("Registration Error:", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
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
                  Create Account
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Join us to start your shopping journey
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
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

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
                      placeholder="Create a strong password"
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {avatarPreview ? (
                        <img className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" src={avatarPreview} alt="Avatar preview" />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                          <RxAvatar className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Choose file
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        name="avatar"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileInputChange}
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>

                <LoadingButton 
                  type="submit" 
                  loading={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Create Account
                </LoadingButton>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      Sign in
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

export default Register
