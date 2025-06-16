"use client"

import { Button } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"
import { VscEyeClosed, VscEye } from "react-icons/vsc"
import { server } from "../../lib/server"

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      )
      .then(() => {
        toast.success("Password updated successfully!")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <div className="w-full px-5 py-8 bg-gray-100 rounded-lg shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Change Password</h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="relative">
          <label htmlFor="oldPassword" className="mb-2 block text-sm font-medium text-gray-700">
            Old Password
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
              onClick={() => setShowOldPassword((prev) => !prev)}
            >
              {showOldPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
            </div>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
            </div>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md border-2 border-blue-600 bg-transparent px-6 py-2 text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Change Password
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
