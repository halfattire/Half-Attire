"use client"

import AdminSidebar from "../../components/Admin/Layout/AdminSidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
