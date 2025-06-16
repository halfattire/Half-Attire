"use client"

import { useEffect, useState } from "react"
import { BsFillBagFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import { backend_url, server } from "../../lib/server"
import axios from "axios"
import { toast } from "react-toastify"
import Image from "next/image"

function OrderDetails() {
  const { orders, isLoading } = useSelector((state) => state.orders)
  const { seller } = useSelector((state) => state.seller)
  const [status, setStatus] = useState("")

  const params = useParams()
  const id = params.id
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id))
    }
  }, [dispatch, seller?._id])

  const data = orders && orders.find((item) => item._id === id)

  // Set initial status when data loads
  useEffect(() => {
    if (data && !status) {
      setStatus(data.status)
    }
  }, [data, status])

  // Helper function to get item price
  const getItemPrice = (item) => {
    // Handle variable products
    if (item.selectedVariation && item.selectedVariation.price) {
      return item.selectedVariation.price
    }
    // Handle regular products
    if (item.discountPrice && item.discountPrice > 0) {
      return item.discountPrice
    }
    if (item.originalPrice && item.originalPrice > 0) {
      return item.originalPrice
    }
    // Fallback: try to get price from item.price
    if (item.price && item.price > 0) {
      return item.price
    }
    // Last resort: calculate from total if individual prices are missing
    if (data?.totalPrice && data?.cart?.length) {
      return Math.round(data.totalPrice / data.cart.reduce((acc, cartItem) => acc + cartItem.qty, 0))
    }
    return 0
  }

  const handleUpdateOrder = async () => {
    try {
      await axios.put(`${server}/order/update-order-status/${id}`, { status }, { withCredentials: true })
      toast.success("Order updated successfully!")
      router.push("/dashboard-orders")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order")
    }
  }

  const refundOrderUpdateHandler = async () => {
    try {
      await axios.put(`${server}/order/order-refund-success/${id}`, { status }, { withCredentials: true })
      toast.success("Order updated successfully!")
      dispatch(getAllOrdersOfShop(seller._id))
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e94560]"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="section min-h-screen py-6 px-4 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Link href="/dashboard-orders">
            <button className="rounded-md bg-[#e94560] hover:bg-[#d03a53] transition-colors px-6 py-2.5 font-medium text-white shadow-sm">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section min-h-screen py-6 px-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-full">
            <BsFillBagFill size={24} color="#e94560" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Order Details</h1>
        </div>
        <div>
          <Link href="/dashboard-orders">
            <button className="rounded-md bg-[#fce1e6] hover:bg-[#f8d0d8] transition-colors px-6 py-2.5 text-sm font-semibold text-[#e94560] shadow-sm">
              Order List
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-6">
        <h5 className="flex items-center gap-1 text-gray-600 text-sm">
          Order ID: <span className="font-medium text-gray-800">#{data._id?.slice(-8)}</span>
        </h5>
        <h5 className="flex items-center gap-1 text-gray-600 text-sm">
          Placed On: <span className="font-medium text-gray-800">{new Date(data.createdAt).toLocaleDateString()}</span>
        </h5>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Order Items</h3>
        {data.cart.map((item, index) => {
          const itemPrice = getItemPrice(item)
          const itemTotal = itemPrice * item.qty

          return (
            <div
              key={index}
              className="mb-4 flex w-full items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-center bg-gray-50 rounded-md p-2">
                <Image
                  src={item.images[0] ? `${backend_url}/${item.images[0]}` : "/assets/fallback-image.png"}
                  className="h-20 w-20 object-contain"
                  alt={item.name || "Product"}
                  width={80}
                  height={80}
                />
              </div>
              <div className="w-full">
                <h5 className="font-medium text-gray-800">{item.name}</h5>
                {/* Show variation details if available */}
                {item.selectedVariation && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.selectedVariation.size && `Size: ${item.selectedVariation.size}`}
                    {item.selectedVariation.size && item.selectedVariation.color && " • "}
                    {item.selectedVariation.color && `Color: ${item.selectedVariation.color}`}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <h5 className="text-sm text-gray-500">
                    PKR {itemPrice} × {item.qty}
                  </h5>
                  <h5 className="text-sm font-medium text-gray-800">PKR {itemTotal}</h5>
                </div>
              </div>
            </div>
          )
        })}

        <div className="w-full border-t border-gray-200 pt-4 text-right">
          <h5 className="text-lg">
            Total Price: <strong className="text-[#e94560]">PKR {data.totalPrice}</strong>
          </h5>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h4 className="text-lg font-medium mb-3 text-gray-800">Shipping Address</h4>
          <div className="space-y-2 text-gray-700">
            <p>{data.shippingAddress?.address1}</p>
            {data.shippingAddress?.address2 && <p>{data.shippingAddress.address2}</p>}
            <p>
              {data.shippingAddress?.city}, {data.shippingAddress?.country}
            </p>
            {data.shippingAddress?.zipCode && <p>ZIP: {data.shippingAddress.zipCode}</p>}
            {data.user?.phoneNumber && <p>Phone: {data.user.phoneNumber}</p>}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h4 className="text-lg font-medium mb-3 text-gray-800">Payment Info</h4>
          <div className="space-y-2 text-gray-700">
            <p>
              Status:{" "}
              <span
                className={
                  data.paymentInfo?.status === "Paid" ? "text-green-600 font-medium" : "text-amber-600 font-medium"
                }
              >
                {data.paymentInfo?.status || "Not Paid"}
              </span>
            </p>
            {data.paymentInfo?.type && (
              <p>
                Payment Method: <span className="font-medium">{data.paymentInfo.type}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <h4 className="text-lg font-medium mb-3 text-gray-800">Customer Information</h4>
        <div className="space-y-2 text-gray-700">
          <p>
            Name: <span className="font-medium">{data.user?.name}</span>
          </p>
          <p>
            Email: <span className="font-medium">{data.user?.email}</span>
          </p>
          {data.user?.phoneNumber && (
            <p>
              Phone: <span className="font-medium">{data.user.phoneNumber}</span>
            </p>
          )}
        </div>
      </div>

      {/* Order Status Update */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <h4 className="text-lg font-medium mb-4 text-gray-800">Order Status</h4>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current Status:</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              data.status === "Delivered"
                ? "bg-green-100 text-green-800"
                : data.status === "Processing"
                  ? "bg-yellow-100 text-yellow-800"
                  : data.status === "Shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {data.status}
          </span>
        </div>

        {data.status !== "Processing refund" && data.status !== "Refund Success" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status:</label>
              <select
                className="w-full max-w-xs rounded-md border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-[#e94560]"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"]
                  .slice(
                    [
                      "Processing",
                      "Transferred to delivery partner",
                      "Shipping",
                      "Received",
                      "On the way",
                      "Delivered",
                    ].indexOf(data.status),
                  )
                  .map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {(data.status === "Processing refund" || data.status === "Refund Success") && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Refund Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full max-w-xs rounded-md border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-[#e94560]"
              >
                {["Processing refund", "Refund Success"]
                  .slice(["Processing refund", "Refund Success"].indexOf(data.status))
                  .map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        <button
          className="mt-4 rounded-md bg-[#e94560] hover:bg-[#d03a53] transition-colors px-6 py-2.5 font-medium text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={data.status !== "Processing refund" ? handleUpdateOrder : refundOrderUpdateHandler}
          disabled={!status || status === data.status}
        >
          Update Status
        </button>
      </div>
    </div>
  )
}

export default OrderDetails
