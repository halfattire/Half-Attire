"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Loader from "../../components/Loader"

export const AdminProtected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.user)
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/")
      } else if (user.role !== "admin") {
        router.push("/")
      } else {
        setIsChecking(false)
      }
    }
  }, [user, loading, router])

  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (user?.role === "admin") {
    return children
  }

  return null
}
