"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import {
  MdLocalShipping,
  MdCheckCircle,
  MdError,
  MdOutlineAutorenew,
} from "react-icons/md";

function TrackOrder() {
  const { orders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const getStatusMessage = (status) => {
    switch (status) {
      case "Processing":
        return {
          message: "Your order is being processed.",
          icon: <MdOutlineAutorenew className="text-yellow-500" size={50} />,
        };
      case "Transferred to delivery partner":
        return {
          message: "Your order is on its way to the delivery partner.",
          icon: <MdLocalShipping className="text-blue-500" size={50} />,
        };
      case "Shipping":
        return {
          message: "Your order is being shipped.",
          icon: <MdLocalShipping className="text-blue-500" size={50} />,
        };
      case "Received":
        return {
          message: "Your order has arrived in your city.",
          icon: <MdLocalShipping className="text-blue-500" size={50} />,
        };
      case "On the way":
        return {
          message: "Our delivery person is on the way to deliver your order.",
          icon: <MdLocalShipping className="text-blue-500" size={50} />,
        };
      case "Delivered":
        return {
          message: "Your order has been delivered!",
          icon: <MdCheckCircle className="text-green-500" size={50} />,
        };
      case "Processing refund":
        return {
          message: "Your refund is being processed.",
          icon: <MdOutlineAutorenew className="text-yellow-500" size={50} />,
        };
      case "Refund Success":
        return {
          message: "Your refund was successful!",
          icon: <MdCheckCircle className="text-green-500" size={50} />,
        };
      default:
        return {
          message: "Unknown status.",
          icon: <MdError className="text-red-500" size={50} />,
        };
    }
  };

  const statusInfo = data
    ? getStatusMessage(data.status)
    : {
        message: "Order not found.",
        icon: <MdError className="text-red-500" size={50} />,
      };

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-gray-100 p-4">
      {statusInfo.icon}
      <h1 className="mt-4 text-[20px]">{statusInfo.message}</h1>
    </div>
  );
}

export default TrackOrder;