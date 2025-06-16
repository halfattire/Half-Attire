"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Lottie from "react-lottie"
import animationData from "../public/assets/Assests/animations/107043-success.json"
import CheckOutSteps from "@/components/CheckOut/CheckOutSteps"
import { getAllOrdersOfUser } from "@/redux/actions/order"

export default function OrderSuccessPage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
      localStorage.removeItem("latestOrder");
    }
  }, [dispatch, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <Header />
      <CheckOutSteps active={3} />
      <Success />
      <Footer />
    </div>
  );
}

function Success() {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="text-center py-8">
      <Lottie options={defaultOptions} width={300} height={200} />
      <h5 className="mb-8 text-[25px] text-[#000000a1]">Your order is successful 😍</h5>
      <div className="space-y-4">
        <p className="text-gray-600">Thank you for your purchase! 🎉</p>
        <p className="text-sm text-gray-500">
          We’re excited to prepare your order. You can check your order details from your profile.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <a
            href="/profile"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View My Orders
          </a>
          <a
            href="/"
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}