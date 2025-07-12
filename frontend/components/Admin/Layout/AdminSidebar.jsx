"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RxDashboard } from "react-icons/rx"
import { CiMoneyBill } from "react-icons/ci"
import { FiShoppingBag } from "react-icons/fi"
import { GrWorkshop } from "react-icons/gr"
import { HiOutlineUserGroup } from "react-icons/hi"
import { FaProductHunt } from "react-icons/fa"
import { MdEmojiEvents } from "react-icons/md"
import { MdOutlineSettings } from "react-icons/md"
import { FaEnvelope } from "react-icons/fa"

const AdminSidebar = ({ onLinkClick }) => {
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick()
    }
  }

  const menuItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: RxDashboard,
      path: "/admin",
    },
    {
      id: 2,
      title: "All Orders",
      icon: FiShoppingBag,
      path: "/admin/orders",
    },
    {
      id: 3,
      title: "All Sellers",
      icon: HiOutlineUserGroup,
      path: "/admin/sellers",
    },
    {
      id: 4,
      title: "All Users",
      icon: GrWorkshop,
      path: "/admin/users",
    },
    {
      id: 5,
      title: "All Products",
      icon: FaProductHunt,
      path: "/admin/products",
    },
    {
      id: 6,
      title: "All Events",
      icon: MdEmojiEvents,
      path: "/admin/events",
    },
    {
      id: 7,
      title: "Newsletter",
      icon: FaEnvelope,
      path: "/admin/newsletter",
    },
    {
      id: 9,
      title: "Withdraw Requests",
      icon: CiMoneyBill,
      path: "/admin/withdraw",
    },
    {
      id: 8,
      title: "Settings",
      icon: MdOutlineSettings,
      path: "/admin/settings",
    },
    
  ]

  return (
    <div className="w-full h-full bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <MdOutlineSettings className="text-white text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">Admin Panel</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-2 px-2 sm:px-3 pb-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <Link key={item.id} href={item.path} className="block" onClick={handleLinkClick}>
                <div
                  className={`group relative flex items-center px-3 sm:px-4 py-3 sm:py-3.5 mx-1 rounded-xl transition-all duration-300 ease-in-out ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-md border border-blue-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-r-full shadow-sm"></div>
                  )}

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 mr-3 sm:mr-4 ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"} transition-colors duration-200`}
                  >
                    <Icon size={18} className="sm:hidden" />
                    <Icon size={22} className="hidden sm:block" />
                  </div>

                  {/* Text */}
                  <span
                    className={`font-semibold text-xs sm:text-sm tracking-wide truncate ${isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"} transition-colors duration-200`}
                  >
                    {item.title}
                  </span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="ml-auto flex items-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full shadow-sm animate-pulse"></div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default AdminSidebar
