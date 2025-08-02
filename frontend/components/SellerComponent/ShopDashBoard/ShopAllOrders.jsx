"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import Loader from "@/components/Loader";
import { getAllOrdersOfShop } from "../../../redux/actions/order";

function ShopAllOrders() {
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Check if user is admin
  const isAdmin = user?.role && user.role.toLowerCase() === "admin";

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  // Show loading state for non-admin users without seller data
  if (!seller && !isAdmin) {
    return (
      <div className="w-full p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loading Orders...</h2>
          <p className="text-gray-600">Please wait while we load your order information.</p>
        </div>
      </div>
    );
  }

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
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
      headerName: "Order Detail",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows =
    orders?.map((item) => ({
      id: item._id,
      itemsQty: item.cart.reduce((sum, cartItem) => sum + (cartItem.qty || 1), 0),
      total: "PKR " + item.totalPrice,
      status: item.status,
    })) || []

  return isLoading ? (
    <Loader />
  ) : (
    <div className="mx-4 mt-4 w-full overflow-hidden bg-white pt-1">
      <Box
        sx={{ height: { xs: 300, sm: 400 }, width: "100%" }}
        className="overflow-auto"
      >
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
      </Box>
    </div>
  );
}

export default ShopAllOrders;