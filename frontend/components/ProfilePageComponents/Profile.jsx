
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
    <div className="bg-gray-100 rounded-lg shadow-sm p-6">
      <div className="flex w-full justify-center mb-8">
        <div className="relative">
          {getAvatarUrl() ? (
            <img
              src={getAvatarUrl() || "/placeholder.svg"}
              className="h-32 w-32 rounded-full border-4 border-blue-600 object-cover object-top"
              alt="User avatar"
              onError={(e) => {
                e.target.src = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
              }}
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-600 bg-gray-200 object-cover">
              <FaUserCircle className="h-24 w-24 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-1.5 right-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors shadow-sm">
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
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              ) : (
                <AiOutlineCamera size={18} />
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="section py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First row */}
            <div className="w-full">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="w-full max-w-full overflow-x-hidden flex flex-col">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 break-words">
                {user.email}
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Second row */}
            <div className="w-full">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="w-full flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md border-2 border-blue-600 bg-transparent px-6 py-2 text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : updateSuccess ? "Updated!" : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
