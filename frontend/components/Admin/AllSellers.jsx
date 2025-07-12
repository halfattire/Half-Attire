"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import styles from "@/style/style";
import axios from "axios";
import { server } from "@/lib/server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/seller";
import Link from "next/link";

const AllSellers = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { sellers } = useSelector((state) => state.seller);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    await axios
      .delete(`${server}/shop/admin-delete-seller/${id}`, config)
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllSellers());
      })
      .catch((error) => {
        toast.error(error.response?.data.message);
      });
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "Seller ID", flex: 0.7 },
    { field: "name", headerName: "Name", flex: 0.7 },
    { field: "email", headerName: "Email", type: "email", flex: 0.7 },
    { field: "address", headerName: "Seller Address", type: "address", flex: 0.7 },
    { field: "joinedAt", headerName: "joinedAt", type: "text", flex: 0.8 },
    {
      field: " ",
      flex: 1,
      headerName: "Preview Shop",
      type: "text",
      sortable: false,
      renderCell: (params) => (
        <Link href={`/shop/preview/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "  ",
      flex: 1,
      headerName: "Delete Seller",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => setUserId(params.id) || setOpen(true)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">All Sellers</h1>
          <p className="text-xs sm:text-sm text-gray-600">Manage all registered sellers</p>
        </div>
        
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="overflow-x-auto">
            <DataGrid
              rows={row}
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
                minWidth: "800px", // Prevent table from getting too cramped
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
        </div>
      </div>
      
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-4 sm:p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RxCross1 size={20} />
                </button>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-900 mb-6">
                Are you sure you want to delete this seller?
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  onClick={() => handleDelete(userId)}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSellers;