"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import Loader from "@/components/Loader";
import {
  deleteShopEvent,
  getAllShopEvents,
} from "@/redux/actions/event";

function ShopAllEvents() {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Check if user is admin
  const isAdmin = user?.role && user.role.toLowerCase() === "admin";

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllShopEvents(seller._id));
    }
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    if (seller?._id) {
      await dispatch(deleteShopEvent(id));
      dispatch(getAllShopEvents(seller._id)); // Refresh events without reload
    }
  };

  // Show loading state for non-admin users without seller data
  if (!seller && !isAdmin) {
    return (
      <div className="w-full p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loading Events...</h2>
          <p className="text-gray-600">Please wait while we load your event information.</p>
        </div>
      </div>
    );
  }

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/product/${params.id}?isEvent=true`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
  ];

  const rows =
    events?.map((item) => ({
      id: item._id,
      name: item.name,
      price: `PKR ${item.discountPrice}`,
      stock: item.stock,
      sold: 10,
    })) || [];

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

export default ShopAllEvents;