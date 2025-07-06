"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../lib/server";
import { clearCartAction } from "../../redux/actions/cart";

import PaymentCartData from "./PaymentCartData";
import PaymentInfo from "./PaymentInfo";

const PaymentComponent = () => {
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
      <PaymentInfo
        user={user}
        open={open}
        setOpen={setOpen}
        adminCardPaymentHandler={adminCardPaymentHandler}
        cashOnDeliveryHandler={cashOnDeliveryHandler}
      />
      <PaymentCartData orderData={orderData} />
    </div>
  );
};

export default PaymentComponent;