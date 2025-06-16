"use client"

import { AiOutlineArrowRight } from "react-icons/ai"
import Link from "next/link"
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getAllOrdersOfUser } from "../../redux/actions/order"

function AllOrders() {
  const { user } = useSelector((state) => state.user)
  const { orders, isLoading } = useSelector((state) => state.orders)
  const dispatch = useDispatch()
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
      setLastRefresh(new Date())
    }
  }, [dispatch, user._id])

  const handleRefresh = () => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
      setLastRefresh(new Date())
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 1,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor"
      },
    },
    {
      field: "itemsQty",
      headerName: "Item Qty",
      type: "number",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 1,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Order Detail",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        )
      },
    },
  ]

  const rows = orders
    ? orders.map((item) => ({
        id: item._id,
        itemsQty: item.cart ? item.cart.reduce((acc, cartItem) => acc + cartItem.qty, 0) : 0,
        total: "PKR " + item.totalPrice,
        status: item.status,
      }))
    : []

  return (
    <div className="w-full pl-6 pt-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders && orders.length > 0 ? (
        <div className="w-full overflow-x-auto">
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
            sx={{
              width: '100%',
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'hidden',
              },
              '& .MuiDataGrid-main': {
                width: '100%',
              },
            }}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm mt-2">Your orders will appear here after you make a purchase</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Check for Orders
          </button>
        </div>
      )}
    </div>
  )
}

export default AllOrders