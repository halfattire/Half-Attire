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

const AdminSidebar = () => {
  const pathname = usePathname()

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
    // {
    //   id: 4,
    //   title: "All Users",
    //   icon: GrWorkshop,
    //   path: "/admin/users",
    // },
    // {
    //   id: 5,
    //   title: "All Products",
    //   icon: FaProductHunt,
    //   path: "/admin/products",
    // },
    // {
    //   id: 6,
    //   title: "All Events",
    //   icon: MdEmojiEvents,
    //   path: "/admin/events",
    // },
    // {
    //   id: 7,
    //   title: "Withdraw Requests",
    //   icon: CiMoneyBill,
    //   path: "/admin/withdraw",
    // },
  ]

  return (
    <div className="w-full h-[90vh] bg-gradient-to-b from-white to-gray-50/50 shadow-xl overflow-y-auto sticky top-0 left-0 z-10 border-r border-gray-100">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <MdOutlineSettings className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Admin Panel</h2>
            <p className="text-sm text-gray-500 font-medium">Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-2 px-3 pb-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <Link key={item.id} href={item.path} className="block">
                <div
                  className={`group relative flex items-center px-4 py-3.5 mx-1 rounded-xl transition-all duration-300 ease-in-out ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-50/70 text-blue-700 shadow-sm border border-blue-100/50"
                      : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-r-full shadow-sm"></div>
                  )}

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 mr-4 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} transition-colors duration-200`}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Text */}
                  <span
                    className={`font-semibold text-sm tracking-wide ${isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"} transition-colors duration-200`}
                  >
                    {item.title}
                  </span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="ml-auto flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full shadow-sm animate-pulse"></div>
                    </div>
                  )}

                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50/80 to-transparent pointer-events-none"></div>
    </div>
  )
}

export default AdminSidebar
