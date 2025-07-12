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
    console.log('AdminProtected: useEffect triggered');
    console.log('AdminProtected: loading:', loading, 'user:', user);
    
    if (!loading) {
      if (!user) {
        console.log('AdminProtected: No user found, redirecting to home');
        router.push("/")
      } else if (user.role !== "admin") {
        console.log('AdminProtected: User role is not admin:', user.role, 'redirecting to home');
        router.push("/")
      } else {
        console.log('AdminProtected: User is admin, allowing access');
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
