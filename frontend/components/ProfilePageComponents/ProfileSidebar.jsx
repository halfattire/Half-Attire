"use client"

import { RxPerson } from "react-icons/rx"
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi"
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai"
import { RiLockPasswordLine } from "react-icons/ri"
import { MdOutlineTrackChanges } from "react-icons/md"
import { TbAddressBook } from "react-icons/tb"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { logout } from "../../redux/actions/user"

function ProfileSidebar({ active, setActive, onItemClick }) {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      console.log("ProfileSidebar: Starting logout...")
      
      await dispatch(logout())
      
      router.push("/login")
      toast.success("Successfully logged out")
    } catch (error) {
      console.error("ProfileSidebar: Logout error:", error)
      toast.error("Logout failed. Please try again.")
      
      router.push("/login")
    }
  }

  const handleItemClick = (activeIndex, path = null) => {
    setActive(activeIndex)
    if (onItemClick) onItemClick()
    if (path) router.push(path)
  }

  const menuItems = [
    {
      id: 1,
      icon: RxPerson,
      label: "Profile",
      onClick: () => handleItemClick(1)
    },
    {
      id: 2,
      icon: HiOutlineShoppingBag,
      label: "Orders",
      onClick: () => handleItemClick(2)
    },
    {
      id: 3,
      icon: HiOutlineReceiptRefund,
      label: "Refunds",
      onClick: () => handleItemClick(3)
    },
    {
      id: 4,
      icon: AiOutlineMessage,
      label: "Inbox",
      onClick: () => handleItemClick(4)
    },
    {
      id: 5,
      icon: MdOutlineTrackChanges,
      label: "Track Order",
      onClick: () => handleItemClick(5)
    },
    {
      id: 6,
      icon: RiLockPasswordLine,
      label: "Change Password",
      onClick: () => handleItemClick(6)
    },
    {
      id: 7,
      icon: TbAddressBook,
      label: "Address",
      onClick: () => handleItemClick(7)
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = active === item.id

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                <IconComponent size={20} />
              </div>
              <span className={`font-medium text-sm ${isActive ? "text-blue-700" : "text-gray-700"}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          )
        })}

        {/* Logout Button */}
        <div className="border-t border-gray-100 mt-4 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <AiOutlineLogin size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileSidebar
