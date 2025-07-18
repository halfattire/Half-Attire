"use client";

import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "@/lib/server";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllShopProducts } from "../../redux/actions/product";
import Loader from "@/components/Loader";
import Image from "next/image";
import SafeAvatar from "../SafeAvatar";
import { calculateShopRating, getShopRatingText } from "../../lib/utils/shopRating";

function ShopInfo({ isOwner }) {
  const router = useRouter();
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllShopProducts(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch, id]);
  
  const handleLogout = async () => {
    try {
      // First, clear any localStorage items
      localStorage.removeItem("seller_token")
      localStorage.removeItem("sellerData")
  
      // Then make the logout request
      const res = await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      })
  
      toast.success(res.data.message)
  
      // Force a hard refresh to ensure all state is cleared
      window.location.href = "/shop-login"
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(error.response?.data?.message || "Logout failed")
      
      // Even if logout fails, clear local data and redirect
      localStorage.removeItem("seller_token")
      localStorage.removeItem("sellerData")
      window.location.href = "/shop-login"
    }
  }

  // Enhanced shop rating calculation
  const shopRatingData = calculateShopRating(products);
  const shopRatingText = getShopRatingText(shopRatingData.reviewCount);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="">
      <div>
        <div className="flex flex-col items-center">
          <SafeAvatar
            src={data?.avatar}
            alt={data?.name || "Shop Avatar"}
            width={128}
            height={128}
            className="h-32 w-32 rounded-full border-4 border-gray-200 object-cover"
            fallback={<CgProfile className="h-32 w-32 text-gray-400" />}
          />
          <h2 className="mt-4 text-xl font-bold">{data.name}</h2>
          <p className="mt-2 text-gray-600">{data.description}</p>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex flex-wrap justify-between text-gray-700">
            <span className="font-semibold">Address:</span>
            <span>{data.address}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Phone Number:</span>
            <span>{data.phoneNumber}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Total Products:</span>
            <span>{products && products.length}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Shop Rating:</span>
            <span>{shopRatingData.displayRating}/5.0</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Total Reviews:</span>
            <span>{shopRatingData.reviewCount}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Joined On:</span>
            <span>{data.createdAt ? data.createdAt.slice(0, 10) : ""}</span>
          </div>
        </div>
      </div>
      {isOwner && (
        <div className="mt-6 flex flex-col gap-4">
          <Link href="/settings">
            <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-700">
              Edit Shop
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 py-3 font-semibold text-white shadow-lg transition duration-300 hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default ShopInfo;