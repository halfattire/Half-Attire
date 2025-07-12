"use client"

import { useEffect, useState } from "react"
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai"
import { MdBorderClear } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import Link from "next/link"
import { getAllOrdersOfShop } from "@/redux/actions/order"
import { getAllShopProducts } from "@/redux/actions/product"
import Loader from "../../Loader"
// import LoadingButton from "../../LoadingButton"

function DashBoardHero() {
  const dispatch = useDispatch()
  const { orders, isLoading } = useSelector((state) => state.orders)
  const { seller } = useSelector((state) => state.seller)
  const { products } = useSelector((state) => state.products)
  const [deliveredOrder, setDeliveredOrder] = useState(null)
  const [refreshLoading, setRefreshLoading] = useState(false)

  // NEW: Add refresh interval and force refresh on mount
  useEffect(() => {
    if (seller?._id) {
      // Initial fetch
      dispatch(getAllOrdersOfShop(seller._id))
      dispatch(getAllShopProducts(seller._id))

      // Set up interval to refresh orders every 30 seconds
      const interval = setInterval(() => {
        dispatch(getAllOrdersOfShop(seller._id))
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [dispatch, seller._id])

  // NEW: Separate useEffect for delivered orders calculation
  useEffect(() => {
    if (orders && orders.length > 0) {
      const orderData = orders.filter((item) => item.status === "Delivered")
      setDeliveredOrder(orderData)
    }
  }, [orders])

  // NEW: Add manual refresh function
  const handleRefreshOrders = async () => {
    if (seller?._id) {
      setRefreshLoading(true)
      try {
        await dispatch(getAllOrdersOfShop(seller._id))
      } finally {
        setRefreshLoading(false)
      }
    }
  }

  const totalEarningWithoutTax = deliveredOrder && deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0)

  const serviceCharge = totalEarningWithoutTax * 0.1
  const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2)

  const columns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 100, 
      flex: 0.8,
      hide: false,
      renderCell: (params) => (
        <div className="truncate" title={params.value}>
          {params.value?.substring(0, 8)}...
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 80,
      flex: 0.6,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor"
      },
      renderCell: (params) => (
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          params.value === "Delivered" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {params.value}
        </div>
      ),
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 60,
      flex: 0.4,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 80,
      flex: 0.6,
      renderCell: (params) => (
        <div className="font-medium text-gray-900">
          {params.value}
        </div>
      ),
    },
    {
      field: " ",
      flex: 0.4,
      minWidth: 60,
      headerName: "",
      type: "number",
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Link href={`/order/${params.id}`}>
            <Button 
              variant="contained" 
              color="primary"
              size="small"
              sx={{ 
                minWidth: 'auto',
                padding: { xs: '2px 4px', sm: '4px 8px' },
                fontSize: { xs: '10px', sm: '12px' },
                '& .MuiButton-startIcon': {
                  margin: 0,
                }
              }}
            >
              <AiOutlineArrowRight size={14} />
            </Button>
          </Link>
        )
      },
    },
  ]

  // NEW: Improved rows mapping with better error handling
  const rows =
    orders && orders.length > 0
      ? orders.map((item) => ({
          id: item._id,
          itemsQty: item.cart ? item.cart.reduce((acc, cartItem) => acc + cartItem.qty, 0) : 0,
          total: "PKR " + item.totalPrice,
          status: item.status,
        }))
      : []

  return (
    <div className="w-full bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="font-Poppins text-lg sm:text-xl lg:text-[24px] font-semibold text-gray-800">
          Dashboard Overview
        </h3>
        <button
          onClick={handleRefreshOrders}
          disabled={refreshLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50"
        >
          {refreshLoading ? "Loading..." : "Refresh Orders"}
        </button>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <MdBorderClear size={24} className="mr-2 text-green-500 sm:text-[30px]" />
            <h3 className="font-Roboto text-base sm:text-lg lg:text-[20px] font-medium text-[#333]">All Orders</h3>
          </div>
          <h5 className="text-lg sm:text-xl lg:text-[22px] font-semibold">{orders ? orders.length : 0}</h5>
          <Link href="/dashboard-orders" className="mt-4 inline-block text-green-500 text-sm sm:text-base hover:underline">
            View Orders
          </Link>
        </div>

        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <AiOutlineMoneyCollect size={24} className="mr-2 text-red-500 sm:text-[30px]" />
            <h3 className="font-Roboto text-base sm:text-lg lg:text-[20px] font-medium text-[#333]">All Products</h3>
          </div>
          <h5 className="text-lg sm:text-xl lg:text-[22px] font-semibold">{products ? products.length : 0}</h5>
          <Link href="/dashboard-products" className="mt-4 inline-block text-red-500 text-sm sm:text-base hover:underline">
            View Products
          </Link>
        </div>

        <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <AiOutlineMoneyCollect size={24} className="mr-2 text-blue-500 sm:text-[30px]" />
            <h3 className="font-Roboto text-base sm:text-lg lg:text-[20px] font-medium text-[#333]">Pending Orders</h3>
          </div>
          <h5 className="text-lg sm:text-xl lg:text-[22px] font-semibold">
            {orders ? orders.filter((order) => order.status === "Processing").length : 0}
          </h5>
          <Link href="/dashboard-orders" className="mt-4 inline-block text-blue-500 text-sm sm:text-base hover:underline">
            View Pending
          </Link>
        </div>
      </div>

      <br />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h3 className="font-Poppins text-lg sm:text-xl lg:text-[24px] font-semibold text-gray-800">
          Latest Orders
        </h3>
        {orders && orders.length > 0 && (
          <p className="text-xs sm:text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="w-full rounded-lg bg-white p-4 sm:p-6 shadow-md">
        {isLoading ? (
          <Loader />
        ) : orders && orders.length > 0 ? (
          <div className="w-full" style={{ minHeight: 400, overflow: 'hidden' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
              autoHeight
              disableColumnResize
              disableColumnReorder
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                  minWidth: 0,
                  width: '100%',
                },
                '& .MuiDataGrid-main': {
                  overflow: 'hidden',
                },
                '& .MuiDataGrid-cell': {
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  padding: { xs: '4px 2px', sm: '8px 4px', md: '8px 16px' },
                  borderRight: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  fontWeight: 600,
                  borderBottom: '1px solid #e0e0e0',
                },
                '& .MuiDataGrid-columnHeader': {
                  padding: { xs: '4px 2px', sm: '8px 4px', md: '8px 16px' },
                },
                '& .MuiDataGrid-virtualScroller': {
                  minHeight: '200px',
                  overflow: 'auto',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid #e0e0e0',
                  minHeight: '40px',
                },
                '& .MuiTablePagination-root': {
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                },
                minWidth: 0,
                width: '100%',
                overflow: 'hidden',
              }}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers place them</p>
            <button
              onClick={handleRefreshOrders}
              disabled={refreshLoading}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {refreshLoading ? "Loading..." : "Check for New Orders"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashBoardHero
