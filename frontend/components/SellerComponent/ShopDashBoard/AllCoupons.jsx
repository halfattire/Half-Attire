"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineDelete } from "react-icons/ai"
import { DataGrid } from "@mui/x-data-grid"
import { Box, Button } from "@mui/material"
import Loader from "@/components/Loader"
import { IoClose } from "react-icons/io5"
import axios from "axios"
import { server } from "../../../lib/server"
import { toast } from "react-toastify"

function AllCoupons() {
  const { products } = useSelector((state) => state.products)
  const { seller } = useSelector((state) => state.seller)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [coupons, setCoupons] = useState([])
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [selectedProducts, setSelectedProducts] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if user is admin
  const isAdmin = user?.role && user.role.toLowerCase() === "admin"

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    if (seller?._id) {
      axios
        .get(`${server}/couponscode/get-coupons/${seller._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setIsLoading(false)
          setCoupons(res.data.couponCodes || [])
        })
        .catch((error) => {
          setIsLoading(false)
          console.error("Error fetching coupons:", error)
        })
    } else if (isAdmin) {
      // Admin users don't have seller data, show empty state or admin message
      setIsLoading(false)
      setCoupons([])
    } else {
      setIsLoading(false)
    }
  }, [dispatch, seller?._id, isAdmin])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/couponscode/delete-coupon/${id}`, {
        withCredentials: true,
      })
      toast.success("Coupon code deleted successfully!")
      // Refresh coupons without reloading the page
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id))
    } catch (error) {
      toast.error("Error deleting coupon")
      console.error("Delete error:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Null safety check for seller._id
    if (!seller?._id) {
      toast.error("Unable to create coupon: seller information not available")
      return
    }
    
    try {
      await axios.post(
        `${server}/couponscode/create-coupon`,
        {
          name,
          minAmount: Number(minAmount),
          maxAmount: Number(maxAmount),
          selectedProducts,
          value: Number(value),
          shopId: seller._id,
        },
        { withCredentials: true },
      )
      toast.success("Coupon code created successfully!")
      setModalOpen(false)
      // Refresh coupons without reloading the page
      if (seller?._id) {
        axios
          .get(`${server}/couponscode/get-coupons/${seller._id}`, {
            withCredentials: true,
          })
          .then((res) => setCoupons(res.data.couponCodes || []))
      }
      // Reset form
      setName("")
      setValue("")
      setMinAmount("")
      setMaxAmount("")
      setSelectedProducts("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating coupon")
      console.error("Create error:", error)
    }
  }

  // Mobile optimized columns
  const mobileColumns = [
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => <div className="text-xs font-medium break-words overflow-hidden">{params.value}</div>,
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 60,
      flex: 0.5,
      valueGetter: (params) => (params.row && params.row.price !== undefined ? `${params.row.price}%` : "0%"),
      renderCell: (params) => <div className="text-xs font-semibold text-green-600">{params.value}</div>,
    },
    {
      field: "Delete",
      flex: 0.3,
      minWidth: 40,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button size="small" className="min-w-0 p-1" onClick={() => handleDelete(params.id)} title="Delete Coupon">
          <AiOutlineDelete size={14} className="text-red-500" />
        </Button>
      ),
    },
  ]

  // Desktop columns
  const desktopColumns = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => <div className="font-medium text-gray-600 truncate">#{params.value.slice(-8)}</div>,
    },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => <div className="font-medium text-blue-600 break-words">{params.value}</div>,
    },
    {
      field: "price",
      headerName: "Discount Value",
      minWidth: 130,
      flex: 0.6,
      valueGetter: (params) => (params.row && params.row.price !== undefined ? `${params.row.price} %` : "0 %"),
      renderCell: (params) => <div className="font-semibold text-green-600">{params.value}</div>,
    },
    {
      field: "Delete",
      flex: 0.5,
      minWidth: 120,
      headerName: "Action",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleDelete(params.id)}
          startIcon={<AiOutlineDelete size={16} />}
        >
          Delete
        </Button>
      ),
    },
  ]

  const columns = isMobile ? mobileColumns : desktopColumns

  const rows = coupons.map((item) => ({
    id: item._id,
    name: item.name,
    price: item.value || 0,
  }))

  return isLoading ? (
    <Loader />
  ) : isAdmin && !seller?._id ? (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Admin Access</h3>
        <p className="text-gray-500">Coupon management is available for seller accounts only.</p>
      </div>
    </div>
  ) : (
    <>
      <div className="relative mb-4">
        <div className="flex justify-end px-4 pt-4">
          <Button
            variant="contained"
            className="font-semibold text-sm sm:text-base"
            onClick={() => setModalOpen(true)}
            size={isMobile ? "small" : "medium"}
          >
            {isMobile ? "Create" : "Create Coupon Code"}
          </Button>
        </div>
      </div>
      <div className="mx-2 sm:mx-4 w-full overflow-hidden bg-white pt-1">
        <div className="coupon-table-container">
          <Box sx={{ height: { xs: 350, sm: 400 }, width: "100%" }} className="overflow-auto">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={isMobile ? 5 : 10}
              disableSelectionOnClick
              autoHeight={false}
              className="coupon-data-grid"
              sx={{
                "& .MuiDataGrid-root": {
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                },
                "& .MuiDataGrid-cell": {
                  padding: isMobile ? "4px 6px" : "8px 16px",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  lineHeight: "1.2",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8fafc",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: 600,
                },
                "& .MuiDataGrid-row": {
                  minHeight: isMobile ? "40px" : "52px",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f1f5f9",
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "auto",
                },
              }}
            />
          </Box>
        </div>
      </div>
      {modalOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-80 p-4"
        >
          <div className="relative flex w-full max-w-md items-center justify-center">
            <div className="custom-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-[#1e2837] shadow-xl">
              <div className="flex items-center justify-between rounded-t border-b border-gray-700 p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Create Coupon Code</h3>
                <button
                  type="button"
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                  onClick={() => setModalOpen(false)}
                >
                  <IoClose size={20} />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                      Coupon Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon code name..."
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="value" className="mb-2 block text-sm font-medium text-gray-300">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter your coupon code value..."
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="minAmount" className="mb-2 block text-sm font-medium text-gray-300">
                      Minimum Amount
                    </label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Enter your coupon code min amount..."
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxAmount" className="mb-2 block text-sm font-medium text-gray-300">
                      Maximum Amount
                    </label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter your coupon code max amount..."
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="selectedProduct" className="mb-2 block text-sm font-medium text-gray-300">
                      Select Product
                    </label>
                    <select
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 sm:p-3 text-sm sm:text-base text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="">Choose a selected product</option>
                      {products &&
                        products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        textTransform: "none",
                        fontWeight: "medium",
                        padding: isMobile ? "6px 12px" : "8px 16px",
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      }}
                    >
                      Create Coupon
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AllCoupons
