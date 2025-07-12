
"use client"

import { useDispatch, useSelector } from "react-redux"
import { backend_url } from "../../lib/server"
import { AiOutlineCamera } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"
import { useState, useEffect } from "react"
import Loader from "../Loader"
import { updateUserInfomation } from "../../redux/actions/user"
import { toast } from "react-toastify"
import axios from "axios"
import { server } from "../../lib/server"

function Profile() {
  const { user, loading } = useSelector((state) => state.user)
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setPhoneNumber(user.phoneNumber || "")
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUpdateSuccess(false)

    try {
      console.log("Submitting profile update...")

      // Use your existing Redux action
      const result = await dispatch(updateUserInfomation(name, phoneNumber))

      if (result && result.success !== false) {
        setUpdateSuccess(true)
        toast.success("Profile updated successfully")
      } else {
        toast.error(result?.error || "Failed to update profile")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)

      if (updateSuccess) {
        setTimeout(() => setUpdateSuccess(false), 3000)
      }
    }
  }

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setAvatarUploading(true)

    try {
      const base64 = await convertToBase64(file)

      const res = await axios.put(
        `${server}/user/update-avatar`,
        { avatar: base64 },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )

      if (res.data.success) {
        toast.success("Avatar updated successfully")

        // Update Redux state
        if (res.data.user && res.data.user.avatar) {
          dispatch({
            type: "UpdateAvatarSuccess",
            payload: {
              ...user,
              avatar: res.data.user.avatar,
            },
          })

          // Update localStorage
          const userData = JSON.parse(localStorage.getItem("userData") || "{}")
          const updatedUserData = { ...userData, avatar: res.data.user.avatar }
          localStorage.setItem("userData", JSON.stringify(updatedUserData))
        }
      }
    } catch (err) {
      console.error("Avatar update error:", err)
      toast.error(err.response?.data?.message || "Failed to update avatar")
    } finally {
      setAvatarUploading(false)
    }
  }

  if (!user) {
    return <Loader />
  }

  // Helper function to get avatar URL
  const getAvatarUrl = () => {
    if (user.avatar) {
      if (user.avatar.startsWith("http")) {
        return user.avatar
      }
      return `${backend_url}/${user.avatar}`
    }
    return "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="px-6 py-8 border-b border-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative group">
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl() || "/placeholder.svg"}
                className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                alt="User avatar"
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                }}
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white shadow-lg bg-gray-100">
                <FaUserCircle className="h-20 w-20 text-gray-400" />
              </div>
            )}
            
            <div className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-700 cursor-pointer group-hover:scale-110 transform transition-all duration-200">
              <input
                type="file"
                id="avatar"
                hidden
                onChange={handleImageChange}
                accept="image/*"
                disabled={avatarUploading}
              />
              <label htmlFor="avatar" className="cursor-pointer w-full h-full flex items-center justify-center">
                {avatarUploading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <AiOutlineCamera className="h-5 w-5 text-white" />
                )}
              </label>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500">Email address cannot be changed for security reasons</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                updateSuccess
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Updating...
                </div>
              ) : updateSuccess ? (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Updated!
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
