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

  const dispatch = useDispatch()

  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [coupons, setCoupons] = useState([])
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [selectedProducts, setSelectedProducts] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
    }
  }, [dispatch, seller?._id])

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
      axios
        .get(`${server}/couponscode/get-coupons/${seller._id}`, {
          withCredentials: true,
        })
        .then((res) => setCoupons(res.data.couponCodes || []))
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

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
      valueGetter: (params) => (params.row && params.row.price !== undefined ? `${params.row.price} %` : "0 %"),
    },
    {
      field: "Delete",
      flex: 0.5,
      minWidth: 100,
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ]

  const rows = coupons.map((item) => ({
    id: item._id,
    name: item.name,
    price: item.value || 0,
  }))

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="relative">
        <div className="absolute right-0 top-4">
          <Button variant="contained" className="font-semibold" onClick={() => setModalOpen(true)}>
            Create Coupon Code
          </Button>
        </div>
      </div>
      <div className="mx-4 mt-16 w-full overflow-hidden bg-white pt-1">
        <Box sx={{ height: { xs: 300, sm: 400 }, width: "100%" }} className="overflow-auto">
          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
        </Box>
      </div>
      {modalOpen && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-80"
        >
          <div className="relative flex w-full max-w-md items-center justify-center p-4">
            <div className="custom-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-[#1e2837] shadow-xl">
              <div className="flex items-center justify-between rounded-t border-b border-gray-700 p-5">
                <h3 className="text-xl font-semibold text-white">Create Coupon Code</h3>
                <button
                  type="button"
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                  onClick={() => setModalOpen(false)}
                >
                  <IoClose size={24} />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-5" onSubmit={handleSubmit}>
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
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="selectedProduct" className="mb-2 block text-sm font-medium text-gray-300">
                      Select Product
                    </label>
                    <select
                      className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      sx={{
                        textTransform: "none",
                        fontWeight: "medium",
                        padding: "8px 16px",
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
