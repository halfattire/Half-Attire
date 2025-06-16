"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { loadUserSuccess } from "@/redux/reducers/user"
import Cookies from "js-cookie"


export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      const token = localStorage.getItem("token") || Cookies.get("token");
      const userData = localStorage.getItem("userData") || Cookies.get("userData");

      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          dispatch(loadUserSuccess(parsedUserData));
          return;
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          Cookies.remove("token");
          Cookies.remove("userData");
        }
      }

      router.push("/login");
    }
  }, [loading, isAuthenticated, router, dispatch]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!isAuthenticated) {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (token) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    return null;
  }

  return children;
}