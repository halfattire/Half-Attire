"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import Link from "next/link";
import { AdminProtected } from "../../../hooks/AdminProtected";
import Loader from "../../../../components/Loader";
import { server } from "../../../../lib/server";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrderDetail = () => {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      console.log("🔍 Frontend: Fetching order with ID:", orderId);
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${server}/order/admin/order/${orderId}`;
      console.log("📡 Frontend: Making request to:", url);

      const { data } = await axios.get(url, {
        withCredentials: true,
      });

      console.log("✅ Frontend: Response received:", data);

      if (data.success) {
        setOrder(data.order);
      } else {
        setError("Order not found");
      }
    } catch (error) {
      console.error("❌ Frontend: Error fetching order details:", error);
      console.error("❌ Frontend: Error response:", error.response?.data);
      setError(error.response?.data?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `${server}/order/admin/order/${orderId}`,
        { status: newStatus },
        { withCredentials: true },
      );

      if (data.success) {
        setOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminProtected>
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      </AdminProtected>
    );
  }

  if (error) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-2">{error}</p>
              <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
              <div className="space-y-4">
                <button
                  onClick={fetchOrderDetails}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-4"
                >
                  Try Again
                </button>
                <Link href="/admin/orders">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Back to Orders
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/orders">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <AiOutlineArrowLeft size={20} />
                  Back to Orders
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order?._id?.slice(-8)}</h1>
                <p className="text-gray-600">Placed on {new Date(order?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={fetchOrderDetails}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdRefresh />
              Refresh
            </button>
          </div>

          {/* Order Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order?.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order?.status === "Processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : order?.status === "Shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order?.status}
              </span>
            </div>

            {/* Status Update Buttons */}
            <div className="flex flex-wrap gap-2">
              {order?.status === "Processing" && (
                <button
                  onClick={() => updateOrderStatus("Shipped")}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Mark as Shipped
                </button>
              )}
              {order?.status === "Shipped" && (
                <button
                  onClick={() => updateOrderStatus("Delivered")}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Mark as Delivered
                </button>
              )}
              {["Processing", "Shipped"].includes(order?.status) && (
                <button
                  onClick={() => updateOrderStatus("Cancelled")}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">{order?.user?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order?.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">PKR {order?.totalPrice || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items Count</p>
                <p className="font-medium">{order?.cart?.length || 0} items</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order?.cart?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Shop: {item.shop?.name}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600">Qty: {item.qty}</span>
                      <span className="font-medium text-gray-900">PKR {item.discountPrice || item.originalPrice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      PKR {((item.discountPrice || item.originalPrice) * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
};

export default AdminOrderDetail;