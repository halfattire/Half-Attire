"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import AdminDashboardMain from "../../components/Admin/Layout/AdminDashBoardMain"
import { AdminProtected } from "../../app/hooks/AdminProtected"
import Loader from "../../components/Loader"

export default function AdminDashboard() {
  const { user, loading } = useSelector((state) => state.user)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading while checking authentication
  if (!isClient || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader />
      </div>
    )
  }

  return (
    <AdminProtected>
      <AdminDashboardMain />
    </AdminProtected>
  )
}
