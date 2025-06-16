"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteShopProducts,
  getAllShopProducts,
} from "@/redux/actions/product";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import Loader from "@/components/Loader";

function ShopAllProducts() {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllShopProducts(seller._id));
    }
  }, [dispatch, seller._id]);

  const handleDelete = async (id) => {
    await dispatch(deleteShopProducts(id));
    dispatch(getAllShopProducts(seller._id)); // Refresh products without reload
  };

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 0.8,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.5,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 100,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Link href={`/product/${encodeURIComponent(params.row.id)}`}>
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
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Button onClick={() => handleDelete(params.row.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
  ];

  const rows =
    products?.map((item) => ({
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

export default ShopAllProducts;