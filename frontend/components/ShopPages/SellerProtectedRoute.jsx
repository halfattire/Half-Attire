"use client"; 

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading: sellerLoading, isSeller } = useSelector((state) => state.seller);
  const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
  const router = useRouter();

  // Check if user is either a seller or an admin
  const isAdmin = user?.role && user.role.toLowerCase() === "admin";
  const hasAccess = isSeller || isAdmin;

  // We need to wait for both user and seller states to finish loading
  const isLoading = userLoading || sellerLoading;

  useEffect(() => {
    // If loading is complete and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      console.log("SellerProtectedRoute: User not authenticated, redirecting to shop-login");
      router.push("/shop-login");
      return;
    }

    // If loading is complete, user is authenticated, but doesn't have seller/admin access
    if (!isLoading && isAuthenticated && !hasAccess) {
      console.log("SellerProtectedRoute: User authenticated but no seller/admin access, redirecting to shop-login");
      router.push("/shop-login");
      return;
    }
  }, [isLoading, isAuthenticated, hasAccess, router]);

  // Show loader while checking authentication and authorization
  if (isLoading) {
    return <Loader />;
  }

  // If user is not authenticated, don't render children (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return <Loader />;
  }

  // If user is authenticated but doesn't have access, don't render children
  if (!hasAccess) {
    return <Loader />;
  }

  return children;
};

export default SellerProtectedRoute;