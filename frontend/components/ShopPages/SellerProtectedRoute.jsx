"use client"; 

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSeller) {
      router.push("/shop-login"); 
    }
  }, [isLoading, isSeller, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isSeller) {
    return null;
  }

  return children;
};

export default SellerProtectedRoute;