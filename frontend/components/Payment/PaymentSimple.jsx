"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../lib/server";
import { clearCartAction } from "../../redux/actions/cart";

function Payment() {
  const { user } = useSelector((state) => state.user);
  const [orderData, setOrderData] = useState(null);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user,
    totalPrice: orderData?.totalPrice,
  };

  // Admin card payment handler
  const adminCardPaymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      order.paymentInfo = {
        type: "Admin Card Payment",
        status: "succeeded",
        adminCard: true,
      };

      await axios.post(`${server}/order/create-order`, order, config);

      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      dispatch(clearCartAction());

      setOpen(false);
      router.push("/order/success");
      toast.success("Order successful! Payment processed via admin card.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios.post(`${server}/order/create-order`, order, config).then(() => {
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      dispatch(clearCartAction());
      setOpen(false);
      router.push("/order/success");
      toast.success("Order successful!");
    });
  };

  return (
    <div className="mx-auto flex w-11/12 flex-col items-start gap-6 md:flex-row lg:w-[80%]">
      <div className="mt-4 w-full rounded-md bg-white p-6 shadow-sm md:w-3/5">
        <h2 className="text-2xl font-semibold mb-6">Payment Options</h2>
        
        {/* Admin Card Payment */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Admin Card Payment</h3>
          <form onSubmit={adminCardPaymentHandler}>
            <p className="text-sm text-gray-600 mb-3">
              Payment will be processed using the admin's secure payment system.
            </p>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Pay with Admin Card
            </button>
          </form>
        </div>

        {/* Cash on Delivery */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Cash on Delivery</h3>
          <form onSubmit={cashOnDeliveryHandler}>
            <p className="text-sm text-gray-600 mb-3">
              Pay when your order is delivered to your doorstep.
            </p>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Confirm Order
            </button>
          </form>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="w-full rounded-md bg-white p-6 shadow-sm md:mt-4 md:w-2/5">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-base font-semibold text-gray-600">
              PKR{orderData && orderData?.subTotalPrice}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">Shipping</p>
            <p className="text-base font-semibold text-gray-600">
              PKR{orderData && orderData?.shipping?.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">Discount</p>
            <p className="text-base font-semibold text-gray-600">
              PKR{orderData && orderData?.discountPrice?.toFixed(2)}
            </p>
          </div>
          <hr />
          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-semibold text-gray-900">Total</p>
            <p className="text-lg font-semibold text-gray-900">
              PKR{orderData && orderData?.totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
