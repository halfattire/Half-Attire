"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear, MdRefresh } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfAdmin } from "@/redux/actions/order";
import { getAllSellers } from "@/redux/actions/seller";
import Loader from "../../../components/Loader";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  // Use state.orders to match the reverted store with orders: orderReducer
  const orderState = useSelector((state) => state.orders || {});
  const sellerState = useSelector((state) => state.seller || {});
  const userState = useSelector((state) => state.user || {});

  const { adminOrders = [], adminOrderLoading = false, error, lastUpdated } = orderState;
  const { sellers = [] } = sellerState;
  const { user } = userState;

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!user || !user.role || user.role.toLowerCase() !== "admin") {
      console.log("AdminDashboard: User not admin, skipping data fetch. User role:", user?.role);
      return;
    }

    console.log("AdminDashboard: Fetching admin data...");
    try {
      await dispatch(getAllOrdersOfAdmin());
      await dispatch(getAllSellers());
      setLastRefresh(new Date());
      setIsInitialized(true);
      console.log("AdminDashboard: Data fetch completed successfully");
    } catch (error) {
      console.error("AdminDashboard: Error fetching admin data:", error);
    }
  }, [dispatch, user]);

  // Effect to trigger data fetch
  useEffect(() => {
    if (user && user.role && user.role.toLowerCase() === "admin" && !isInitialized) {
      console.log("AdminDashboard: Triggering initial data fetch for admin user");
      fetchData();
    }
  }, [user, fetchData, isInitialized]);

  // Debug state changes
  // useEffect(() => {
  //   // console.log("📊 AdminOrders state changed:", {
  //   //   length: adminOrders?.length || 0,
  //   //   loading: adminOrderLoading,
  //   //   error,
  //   //   lastUpdated,
  //   //   orders: adminOrders,
  //   // });
  // }, [adminOrders, adminOrderLoading, error, lastUpdated]);

  const handleRefresh = () => {
    fetchData();
  };

  // Memoized statistics
  const statistics = useMemo(() => {
    // console.log("🧮 Calculating statistics with adminOrders:", adminOrders?.length || 0);

    if (!Array.isArray(adminOrders)) {
      return {
        totalOrders: 0,
        totalSellers: sellers?.length || 0,
        deliveredCount: 0,
        processingCount: 0,
        otherStatusCount: 0,
        adminBalance: "0.00",
        totalRevenue: "0.00",
      };
    }

    const totalOrders = adminOrders.length;
    const totalSellers = sellers?.length || 0;
    const deliveredOrders = adminOrders.filter((order) => order?.status === "Delivered");
    const processingOrders = adminOrders.filter((order) => order?.status === "Processing");
    const otherStatusOrders = adminOrders.filter(
      (order) => order?.status && order.status !== "Delivered" && order.status !== "Processing",
    );

    const adminEarning = deliveredOrders.reduce((acc, item) => acc + (item?.totalPrice || 0) * 0.1, 0);
    const totalRevenue = deliveredOrders.reduce((acc, item) => acc + (item?.totalPrice || 0), 0);

    return {
      totalOrders,
      totalSellers,
      deliveredCount: deliveredOrders.length,
      processingCount: processingOrders.length,
      otherStatusCount: otherStatusOrders.length,
      adminBalance: adminEarning.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
    };
  }, [adminOrders, sellers]);

  // Memoized table data
  const tableData = useMemo(() => {
    if (!Array.isArray(adminOrders) || adminOrders.length === 0) {
      return [];
    }

    const data = adminOrders.map((item) => ({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, cartItem) => acc + (cartItem?.qty || 0), 0) || 0,
      total: `PKR ${item?.totalPrice || 0}`,
      status: item?.status || "Unknown",
      createdAt: item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
      shopName: item?.cart?.[0]?.shop?.name || "Unknown Shop",
    }));

    return data;
  }, [adminOrders]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      flex: 0.7,
      renderCell: (params) => (
        <span className="text-blue-600 font-medium">#{params.value?.slice(-8) || "N/A"}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "Delivered"
              ? "bg-green-100 text-green-800"
              : params.value === "Processing"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", flex: 0.7 },
    {
      field: "total",
      headerName: "Total",
      flex: 0.8,
      renderCell: (params) => <span className="font-semibold text-green-600">{params.value}</span>,
    },
    { field: "createdAt", headerName: "Order Date", flex: 0.8 },
    {
      field: "shopName",
      headerName: "Shop",
      flex: 0.8,
      renderCell: (params) => <span className="text-gray-700">{params.value}</span>,
    },
  ];

  if (adminOrderLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h3>
            <p className="text-gray-300 text-xs sm:text-sm">Welcome, {user?.name}</p>
            <p className="text-yellow-400 text-xs mt-1">
              Loaded {statistics.totalOrders} orders • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={adminOrderLoading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm shadow-lg"
          >
            <MdRefresh className={adminOrderLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm shadow-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <AiOutlineMoneyCollect size={24} className="mr-3 text-green-600 sm:text-[30px]" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">Total Earning</h3>
                <p className="text-lg sm:text-2xl font-bold text-green-600">PKR {statistics.adminBalance}</p>
                <p className="text-xs sm:text-sm text-gray-500">10% commission on all orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <FaStore size={24} className="mr-3 text-blue-600 sm:text-[30px]" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">All Sellers</h3>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{statistics.totalSellers}</p>
                <Link href="/admin/sellers" className="text-xs sm:text-sm text-blue-600 hover:underline">
                  View Sellers →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <MdBorderClear size={24} className="mr-3 text-purple-600 sm:text-[30px]" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">All Orders</h3>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">{statistics.totalOrders}</p>
                <Link href="/admin/orders" className="text-xs sm:text-sm text-purple-600 hover:underline">
                  View Orders →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-3 sm:p-4 text-center border border-green-100">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{statistics.deliveredCount}</p>
              <p className="text-sm sm:text-base text-gray-600">Delivered Orders</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 text-center border border-yellow-100">
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{statistics.processingCount}</p>
              <p className="text-sm sm:text-base text-gray-600">Processing Orders</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-center sm:col-span-2 lg:col-span-1 border border-blue-100">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{statistics.otherStatusCount}</p>
              <p className="text-sm sm:text-base text-gray-600">Other Status</p>
              <p className="text-xs text-gray-500">(Shipped, Cancelled, etc.)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Latest Orders</h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Total: {statistics.totalOrders} orders • Updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <Link href="/admin/orders">
              <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <span className="hidden sm:inline">View All Orders</span>
                <span className="sm:hidden">View All</span>
              </button>
            </Link>
          </div>

          <div className="p-3 sm:p-6">
            {tableData.length > 0 ? (
              <div className="overflow-x-auto">
                <DataGrid
                  rows={tableData}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]} 
                  disableRowSelectionOnClick
                  autoHeight
                  sx={{
                    border: "none",
                    minWidth: "600px", // Ensure table doesn't get too cramped
                    "& .MuiDataGrid-cell": {
                      borderBottom: "1px solid #f3f4f6",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" }
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" }
                    },
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <MdBorderClear className="mx-auto text-gray-400 mb-4" size={32} />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                  {error
                    ? "There was an error loading orders"
                    : "Orders will appear here once customers start purchasing"}
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {error ? "Retry" : "Check for Orders"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;