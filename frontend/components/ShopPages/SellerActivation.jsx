"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { server } from "@/lib/server"
import { usePathname, useRouter } from "next/navigation"

export default function SellerActivation({ params }) {
  const [status, setStatus] = useState("loading") // loading, success, or error
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Extract token from URL path if params is undefined
    let token

    if (params && params.token) {
      // If params is provided, use it
      token = params.token
    } else {
      // Otherwise extract from pathname
      const pathParts = pathname.split("/")
      token = pathParts[pathParts.length - 1]
    }
    if (!token) {
      console.error("No token found")
      setStatus("error")
      return
    }

    // Function to activate the seller account
    const activateAccount = async () => {
      try {

        // Make the API request
        const res = await axios.post(
          `${server}/shop/seller/activation`,
          { activation_token: token },
          { headers: { "Content-Type": "application/json" } },
        )

        // If we get here, activation was successful
        setStatus("success")

        // Store token if available
        if (res.data.token) {
          localStorage.setItem("seller_token", res.data.token)
        }
      } catch (error) {
        console.error("Activation error:", error)

        // Check if the error is due to "Seller already exists"
        if (error.response?.data?.message?.includes("already exists")) {
          // If seller already exists, treat it as a success
          setStatus("success")
        } else {
          setStatus("error")
        }
      }
    }

    // Call the activation function
    activateAccount()
  }, [params, pathname])

  // Handle redirect to dashboard
  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  // Handle redirect to login
  const handleGoToLogin = () => {
    router.push("/login")
  }

  // Simple UI based on status
  return (
    <div className="w-full h-screen flex items-center justify-center p-4 bg-gray-50">
      {status === "loading" && (
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <div className="animate-spin h-10 w-10 border-4 border-[#3321c8] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Activating your shop account...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="bg-green-100 text-green-700 p-6 rounded-lg mb-6">
            <p className="text-xl font-semibold">Your shop account is created successfully!</p>
            <p className="mt-2">You can now log in to access your dashboard.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleGoToDashboard}
              className="px-6 py-2 bg-[#3321c8] text-white rounded-md hover:bg-[#2a1ba3] transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleGoToLogin}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg mb-6">
            <p className="text-xl font-semibold">Activation Failed</p>
            <p className="mt-2">Your token is expired or invalid.</p>
            <p className="mt-2 text-sm">If you've already registered, you can proceed to login.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => router.push("/shop-create")}
              className="px-6 py-2 bg-[#3321c8] text-white rounded-md hover:bg-[#2a1ba3] transition-colors"
            >
              Register Again
            </button>
            <button
              onClick={handleGoToLogin}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
