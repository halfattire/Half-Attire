"use client"

import { useEffect, useState } from "react"
import { BsPencil } from "react-icons/bs"
import { RxCross1 } from "react-icons/rx"
import { MdRefresh } from "react-icons/md"
import { DataGrid } from "@mui/x-data-grid"
import { toast } from "react-toastify"
import axios from "axios"
import { server } from "../../lib/server"
import Loader from "../../components/Loader"


const AllWithdraw = () => {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [withdrawData, setWithdrawData] = useState()
  const [withdrawStatus, setWithdrawStatus] = useState("Processing")
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    fetchWithdrawRequests()
  }, [])

  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      setData(response.data.withdraws)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching withdraw requests:", error)
      toast.error("Failed to fetch withdraw requests")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchWithdrawRequests()
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
          status: withdrawStatus,
        },
        { withCredentials: true },
      )
      toast.success("Withdraw request updated successfully!")
      setData(response.data.withdraws)
      setOpen(false)
    } catch (error) {
      toast.error("Failed to update withdraw request")
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "Withdraw ID",
      flex: 0.8,
      renderCell: (params) => <span className="text-blue-600 font-medium">#{params.value.slice(-8)}</span>,
    },
    {
      field: "name",
      headerName: "Shop Name",
      flex: 1,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: "shopId",
      headerName: "Shop ID",
      flex: 0.8,
      renderCell: (params) => <span className="text-gray-600">#{params.value.slice(-8)}</span>,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.6,
      renderCell: (params) => <span className="font-semibold text-green-600">{params.value}</span>,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "Succeed"
              ? "bg-green-100 text-green-800"
              : params.value === "Processing"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Request Date",
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "Update Status",
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <div className="flex justify-center">
          {params.row.status === "Processing" && (
            <BsPencil
              size={20}
              className="cursor-pointer text-blue-600 hover:text-blue-800"
              onClick={() => {
                setOpen(true)
                setWithdrawData(params.row)
                setWithdrawStatus(params.row.status)
              }}
            />
          )}
        </div>
      ),
    },
  ]

  const rows = data.map((item) => ({
    id: item._id,
    shopId: item.seller._id,
    name: item.seller.name,
    amount: `PKR ${item.amount}`,
    status: item.status,
    createdAt: new Date(item.createdAt).toLocaleDateString(),
  }))

  // Calculate statistics
  const totalRequests = data.length
  const processingRequests = data.filter((item) => item.status === "Processing").length
  const succeededRequests = data.filter((item) => item.status === "Succeed").length
  const totalAmount = data.reduce((acc, item) => acc + item.amount, 0)

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Requests</h1>
          <p className="text-gray-600">Manage seller withdrawal requests</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <MdRefresh className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Total Requests</h3>
          <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Processing</h3>
          <p className="text-2xl font-bold text-yellow-600">{processingRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{succeededRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
          <p className="text-2xl font-bold text-blue-600">PKR {totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Withdraw Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Withdrawal Management</h2>
          <p className="text-sm text-gray-600">Process and manage seller withdrawal requests</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : rows.length > 0 ? (
            <DataGrid
              rows={rows}
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
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f3f4f6",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                },
              }}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawal requests found</h3>
              <p className="text-gray-600">Requests will appear here when sellers request withdrawals</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Withdraw Status</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <RxCross1 size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Shop: {withdrawData?.name}</p>
              <p className="text-sm text-gray-600 mb-4">Amount: {withdrawData?.amount}</p>

              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={withdrawStatus}
                onChange={(e) => setWithdrawStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Processing">Processing</option>
                <option value="Succeed">Succeed</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllWithdraw
