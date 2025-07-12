"use client";

import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import Loader from "../../components/Loader";

function AllRefundOrders() {
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  // Mobile optimized columns
  const mobileColumns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 120, 
      flex: 1,
      renderCell: (params) => (
        <div className="text-xs font-medium truncate">
          {params.value.slice(-8)}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <div className={`text-xs px-2 py-1 rounded-full text-center ${
          params.value === "Delivered" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {params.value}
        </div>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 90,
      flex: 0.7,
      renderCell: (params) => (
        <div className="text-xs font-semibold">
          {params.value}
        </div>
      ),
    },
    {
      field: " ",
      headerName: "",
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/user/order/${params.id}`}>
            <Button size="small" className="min-w-0 p-1">
              <AiOutlineArrowRight size={16} />
            </Button>
          </Link>
        );
      },
    },
  ];

  // Desktop columns
  const desktopColumns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
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
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = eligibleOrders
    ? eligibleOrders.map((item) => ({
        id: item._id,
        itemsQty: item.cart.length,
        total: "PKR " + item.totalPrice,
        status: item.status,
      }))
    : [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-2 sm:px-4 lg:px-6 pt-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Refund Orders
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {eligibleOrders?.length || 0} refund requests
              </p>
            </div>
            
            <div className="data-grid-container">
              <DataGrid
                rows={rows}
                columns={isMobile ? mobileColumns : desktopColumns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: isMobile ? 3 : 5,
                    },
                  },
                }}
                pageSizeOptions={isMobile ? [3, 5] : [5, 10]}
                checkboxSelection={!isMobile}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f9fafb',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f9fafb',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    overflowX: 'auto',
                  },
                  minHeight: isMobile ? '300px' : '400px',
                }}
                autoHeight={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllRefundOrders;