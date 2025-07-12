"use client"

import { useState } from "react"
import AdminSidebar from "../../components/Admin/Layout/AdminSidebar"
import { FiMenu, FiX } from "react-icons/fi"

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu button - positioned to not overlap with heading */}
      <div className="lg:hidden fixed top-4 right-4 z-[60]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-lg bg-white shadow-lg border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 backdrop-blur-sm"
        >
          {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-[45] backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-[50] w-64 flex-shrink-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar onLinkClick={closeSidebar} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden lg:ml-0">
        <div className="pt-20 lg:pt-0 min-h-screen"> {/* Padding for mobile menu button */}
          {children}
        </div>
      </div>
    </div>
  )
}
