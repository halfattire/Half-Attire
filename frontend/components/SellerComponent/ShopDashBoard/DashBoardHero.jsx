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

function DashBoardHero() {
  const dispatch = useDispatch()
  const { orders, isLoading } = useSelector((state) => state.orders)
  const { seller } = useSelector((state) => state.seller)
  const { products } = useSelector((state) => state.products)
  const [deliveredOrder, setDeliveredOrder] = useState(null)

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
  const handleRefreshOrders = () => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id))
    }
  }

  const totalEarningWithoutTax = deliveredOrder && deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0)

  const serviceCharge = totalEarningWithoutTax * 0.1
  const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2)

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor"
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/order/${params.id}`}>
            <Button variant="contained" color="primary">
              <AiOutlineArrowRight size={20} />
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
    <div className="w-full bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-Poppins text-[24px]">Dashboard Overview</h3>
        <button
          onClick={handleRefreshOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh Orders
        </button>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <MdBorderClear size={30} className="mr-2 text-green-500" />
            <h3 className="font-Roboto text-[20px] font-medium text-[#333]">All Orders</h3>
          </div>
          <h5 className="text-[22px] font-semibold">{orders ? orders.length : 0}</h5>
          <Link href="/dashboard-orders" className="mt-4 inline-block text-green-500">
            View Orders
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2 text-red-500" />
            <h3 className="font-Roboto text-[20px] font-medium text-[#333]">All Products</h3>
          </div>
          <h5 className="text-[22px] font-semibold">{products ? products.length : 0}</h5>
          <Link href="/dashboard-products" className="mt-4 inline-block text-red-500">
            View Products
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2 text-blue-500" />
            <h3 className="font-Roboto text-[20px] font-medium text-[#333]">Pending Orders</h3>
          </div>
          <h5 className="text-[22px] font-semibold">
            {orders ? orders.filter((order) => order.status === "Processing").length : 0}
          </h5>
          <Link href="/dashboard-orders" className="mt-4 inline-block text-blue-500">
            View Pending
          </Link>
        </div>
      </div>

      <br />
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-Poppins text-[24px]">Latest Orders</h3>
        {orders && orders.length > 0 && (
          <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</p>
        )}
      </div>

      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        {isLoading ? (
          <Loader />
        ) : orders && orders.length > 0 ? (
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
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers place them</p>
            <button
              onClick={handleRefreshOrders}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Check for New Orders
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashBoardHero
