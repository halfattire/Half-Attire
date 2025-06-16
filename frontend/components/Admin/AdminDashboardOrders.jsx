"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import Link from "next/link";
import { getAllOrdersOfAdmin } from "@/redux/actions/order";
import Loader from "../../components/Loader";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders = [], adminOrderLoading = false, error } = useSelector(
    (state) => state.orders || {}
  ); // Fixed to state.orders
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  const fetchOrders = async () => {
    try {
      await dispatch(getAllOrdersOfAdmin());
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    fetchOrders();
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      flex: 0.8,
      renderCell: (params) => (
        <span className="text-blue-600 font-medium">#{params.value.slice(-8)}</span>
      ),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      renderCell: (params) => (
        <div>
          <p className="font-medium">{params.value.name}</p>
          <p className="text-xs text-gray-500">{params.value.email}</p>
        </div>
      ),
    },
    {
      field: "shop",
      headerName: "Shop",
      flex: 0.8,
      renderCell: (params) => <span className="text-gray-700">{params.value}</span>,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "Delivered"
              ? "bg-green-100 text-green-800"
              : params.value === "Processing"
              ? "bg-yellow-100 text-yellow-800"
              : params.value === "Shipped"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.6,
      renderCell: (params) => <span className="font-semibold text-green-600">{params.value}</span>,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      flex: 0.7,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link href={`/admin/order/${params.id}`}>
            <Button size="small" variant="outlined">
              <AiOutlineEye size={16} />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const rows = adminOrders.map((order) => ({
    id: order._id,
    customer: {
      name: order.user?.name || "Unknown",
      email: order.user?.email || "N/A",
    },
    shop: order.cart?.[0]?.shop?.name || "Unknown Shop",
    status: order.status,
    itemsQty: order.cart?.reduce((acc, item) => acc + (item.qty || 0), 0) || 0,
    total: `PKR ${order.totalPrice}`,
    createdAt: new Date(order.createdAt).toLocaleDateString(),
  }));

  // Calculate statistics
  const totalOrders = adminOrders.length;
  const deliveredOrders = adminOrders.filter((order) => order.status === "Delivered").length;
  const processingOrders = adminOrders.filter((order) => order.status === "Processing").length;
  const totalRevenue = adminOrders
    .filter((order) => order.status === "Delivered")
    .reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-600">Manage and track all platform orders</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            disabled={adminOrderLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <MdRefresh className={adminOrderLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Delivered</h3>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Processing</h3>
          <p className="text-2xl font-bold text-yellow-600">{processingOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-600">PKR {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Orders Management</h2>
          <p className="text-sm text-gray-600">View and manage all orders across the platform</p>
        </div>

        <div className="p-6">
          {adminOrderLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading orders: {error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : rows.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f3f4f6",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                },
              }}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here once customers start purchasing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;