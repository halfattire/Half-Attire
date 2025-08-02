"use client";

import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getAllOrdersOfShop } from "../../../redux/actions/order";
import Loader from "../../../components/Loader";

function DashAllRefundOrders() {
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loading Refund Orders...</h2>
          <p className="text-gray-600">Please wait while we load your refund information.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const refundOrders =
    orders &&
    orders.filter(
      (item) =>
        item.status === "Processing refund" || item.status === "Refund Success",
    );

  // Mobile optimized columns
  const mobileColumns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 110, 
      flex: 1,
      renderCell: (params) => (
        <div className="text-xs font-medium truncate">
          #{params.value.slice(-8)}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 90,
      flex: 0.8,
      renderCell: (params) => (
        <div className={`status-badge ${
          params.value === "Refund Success" 
            ? "bg-green-100 text-green-800" 
            : "bg-orange-100 text-orange-800"
        }`}>
          {params.value === "Processing refund" ? "Processing" : params.value}
        </div>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 80,
      flex: 0.7,
      renderCell: (params) => (
        <div className="text-xs font-semibold text-blue-600">
          {params.value}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "",
      flex: 0.5,
      minWidth: 50,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/order/${params.row.id}`}>
            <Button size="small" className="min-w-0 p-1" title="View Order">
              <AiOutlineArrowRight size={14} />
            </Button>
          </Link>
        );
      },
    },
  ];

  // Desktop columns
  const desktopColumns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 150, 
      flex: 0.7,
      renderCell: (params) => (
        <div className="font-medium">
          #{params.value.slice(-12)}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
          params.value === "Refund Success" 
            ? "bg-green-100 text-green-800" 
            : "bg-orange-100 text-orange-800"
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
      renderCell: (params) => (
        <div className="font-semibold text-blue-600">
          {params.value}
        </div>
      ),
    },
    {
      field: "action",
      flex: 1,
      minWidth: 150,
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/order/${params.row.id}`}>
            <Button variant="outlined" size="small" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              View Details <AiOutlineArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        );
      },
    },
  ];
  const rows =
    refundOrders?.map((item) => ({
      id: item._id,
      itemsQty: item.cart.length,
      total: `PKR ${item.totalPrice}`,
      status: item.status,
    })) || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-2 sm:px-4 lg:px-6 pt-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                Refund Orders
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {refundOrders?.length || 0} refund order{refundOrders?.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {refundOrders?.length === 0 ? (
              <div className="p-6 sm:p-8 lg:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No Refund Orders</h3>
                  <p className="text-sm sm:text-base text-gray-600">No refund requests have been made for your products yet.</p>
                </div>
              </div>
            ) : (
              <div className="data-grid-container overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <DataGrid
                    rows={rows}
                    columns={isMobile ? mobileColumns : desktopColumns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: isMobile ? 5 : 10,
                        },
                      },
                    }}
                    pageSizeOptions={isMobile ? [5, 10] : [5, 10, 25]}
                    checkboxSelection={!isMobile}
                    disableRowSelectionOnClick
                    sx={{
                      border: 'none',
                      '& .MuiDataGrid-root': {
                        overflow: 'hidden',
                      },
                      '& .MuiDataGrid-main': {
                        overflow: 'hidden',
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f3f4f6',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        padding: isMobile ? '8px 4px' : '16px 8px',
                      },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#f9fafb',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        fontWeight: 600,
                        padding: isMobile ? '8px 4px' : '16px 8px',
                      },
                      '& .MuiDataGrid-row': {
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: '#fafafa',
                        },
                      },
                      '& .MuiDataGrid-virtualScroller': {
                        overflowX: isMobile ? 'auto' : 'hidden',
                        maxHeight: isMobile ? '400px' : '500px',
                      },
                      '& .MuiDataGrid-footerContainer': {
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                      },
                      minHeight: isMobile ? '350px' : '450px',
                      width: '100%',
                    }}
                    autoHeight={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DashAllRefundOrders;