"use client";

import { useEffect, useState } from "react";
import PaymentCartData from "./PaymentCartData";
import PaymentInfo from "./PaymentInfo";
// Stripe imports commented out to avoid Elements context error
// import {
//   useStripe,
//   useElements,
//   CardNumberElement,
// } from "@stripe/react-stripe-js";
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
  // Stripe hooks commented out to avoid Elements context error
  // const stripe = useStripe();
  // const elements = useElements();
  const dispatch = useDispatch();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user,
    totalPrice: orderData?.totalPrice,
  };

  const paymentHandler = async (e, cardData = null) => {
    e.preventDefault();
    
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (cardData) {
        // Handle manual card payment (Admin Card)
        order.paymentInfo = {
          type: "Admin Card",
          cardNumber: cardData.cardNumber.slice(-4), // Store only last 4 digits
          cardHolderName: cardData.cardHolderName,
          status: "completed"
        };

        // Create the order directly without external payment processing
        await axios.post(`${server}/order/create-order`, order, config);
        
        // Clear local storage and update Redux state
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        dispatch(clearCartAction());
        
        setOpen(false);
        router.push("/order/success");
        toast.success("Order successful! Payment processed via Admin Card.");
        
      } else {
        // Original Stripe payment handler (commented out but preserved)
        /*
        // Request client secret from backend
        const { data } = await axios.post(
          `${server}/payment/process`,
          paymentData,
          config
        );

        const client_secret = data.client_secret;

        if (!stripe || !elements) return;

        // Confirm the payment with Stripe
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
          },
        });

        if (result.error) {
          toast.error(result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            order.paymentInfo = {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              type: "Credit Card",
            };

            // Create the order in the backend
            await axios.post(`${server}/order/create-order`, order, config);
            console.log("Order created successfully");

            // Clear local storage and update Redux state
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("latestOrder", JSON.stringify([]));
            dispatch(clearCartAction());
            console.log("Local storage cleared");

            setOpen(false);
            router.push("/order/success");
            toast.success("Order successful!");
          }
        }
        */
        toast.error("Stripe payment is currently disabled. Please use Admin Card or Cash on Delivery.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Payment failed. Please try again.");
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      order.paymentInfo = {
        type: "Cash On Delivery",
        status: "pending"
      };

      await axios.post(`${server}/order/create-order`, order, config);
      
      // Clear local storage and update Redux state
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      dispatch(clearCartAction());
      
      setOpen(false);
      router.push("/order/success");
      toast.success("Order successful! You can pay when the order arrives.");
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to create order. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex w-11/12 flex-col items-start gap-6 md:flex-row lg:w-[80%]">
      <PaymentInfo
        user={user}
        open={open}
        setOpen={setOpen}
        paymentHandler={paymentHandler}
        cashOnDeliveryHandler={cashOnDeliveryHandler}
      />
      <PaymentCartData orderData={orderData} />
    </div>
  );
}

export default Payment;