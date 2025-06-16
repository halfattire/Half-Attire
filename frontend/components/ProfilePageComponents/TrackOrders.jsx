"use client"

import { MdTrackChanges } from "react-icons/md"
import Link from "next/link"
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { useEffect } from "react"
import { getAllOrdersOfUser } from "../../redux/actions/order"
import { useDispatch, useSelector } from "react-redux"

function TrackOrders() {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.orders)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id))
  }, [dispatch, user._id])

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
          <Link href={`/user/track/order/${params.id}`}>
            <Button>
              <MdTrackChanges size={20} />
            </Button>
          </Link>
        )
      },
    },
  ]

  const rows = orders
    ? orders.map((item) => ({
        id: item._id,
        itemsQty: item.cart.reduce((sum, cartItem) => sum + (cartItem.qty || 1), 0),
        total: "PKR " + item.totalPrice,
        status: item.status,
      }))
    : []

  return (
    <div className="pl-6 pt-1 font-semibold">
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
      />
    </div>
  )
}

export default TrackOrders
