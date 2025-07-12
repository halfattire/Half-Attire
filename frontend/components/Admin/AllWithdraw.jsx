"use client"

import { useEffect, useState } from "react"
import { BsPencil } from "react-icons/bs"
import { RxCross1 } from "react-icons/rx"
import { MdRefresh } from "react-icons/md"
import { FiEye, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi"
import { DataGrid } from "@mui/x-data-grid"
import { toast } from "react-toastify"
import axios from "axios"
import { server } from "../../lib/server"
import Loader from "../../components/Loader"

const AllWithdraw = () => {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedWithdraw, setSelectedWithdraw] = useState(null)
  const [withdrawStatus, setWithdrawStatus] = useState("Processing")
  const [adminNote, setAdminNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    fetchWithdrawRequests()
  }, [])

  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true)

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

      const response = await axios.get(`${server}/withdraw/get-all-withdraw-request`, config)
      if (response.data.success) {
        setData(response.data.withdraws)
        setLastRefresh(new Date())
      }
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

  const handleUpdateStatus = async () => {
    if (!selectedWithdraw) return

    setUpdating(true)
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      // Add Authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.put(
        `${server}/withdraw/update-withdraw-request/${selectedWithdraw._id}`,
        {
          status: withdrawStatus,
          adminNote: adminNote,
        },
        config
      )
      
      if (response.data.success) {
        toast.success(`Withdraw request ${withdrawStatus.toLowerCase()} successfully!`)
        setOpen(false)
        setAdminNote("")
        fetchWithdrawRequests()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update withdraw request")
    } finally {
      setUpdating(false)
    }
  }

  const openUpdateModal = (withdraw) => {
    setSelectedWithdraw(withdraw)
    setWithdrawStatus(withdraw.status)
    setAdminNote("")
    setOpen(true)
  }

  const openDetailsModal = (withdraw) => {
    setSelectedWithdraw(withdraw)
    setDetailsOpen(true)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <FiClock className="text-yellow-500" size={16} />
      case "Succeed":
        return <FiCheckCircle className="text-green-500" size={16} />
      case "Rejected":
        return <FiXCircle className="text-red-500" size={16} />
      default:
        return <FiClock className="text-gray-500" size={16} />
    }
  }

  const columns = [
    {
      field: "transactionId",
      headerName: "Transaction ID",
      flex: 0.8,
      renderCell: (params) => (
        <span className="text-blue-600 font-medium">
          {params.value || `#${params.row.id.slice(-8)}`}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Shop Name",
      flex: 1,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => <span className="text-gray-600">{params.value}</span>,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.6,
      renderCell: (params) => <span className="font-semibold text-green-600">{params.value}</span>,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 0.8,
      renderCell: (params) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {params.value}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(params.value)}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              params.value === "Succeed"
                ? "bg-green-100 text-green-800"
                : params.value === "Processing"
                  ? "bg-yellow-100 text-yellow-800"
                  : params.value === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Request Date",
      flex: 0.8,
      renderCell: (params) => (
        <div className="text-sm">
          <div>{params.value.split(' ')[0]}</div>
          <div className="text-gray-500 text-xs">{params.value.split(' ')[1]}</div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => openDetailsModal(params.row.originalData)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="View Details"
          >
            <FiEye size={16} />
          </button>
          {params.row.status === "Processing" && (
            <button
              onClick={() => openUpdateModal(params.row.originalData)}
              className="p-1 text-green-600 hover:text-green-800 transition-colors"
              title="Update Status"
            >
              <BsPencil size={16} />
            </button>
          )}
        </div>
      ),
    },
  ]

  const rows = data.map((item) => ({
    id: item._id,
    transactionId: item.transactionId,
    name: item.seller?.name || "N/A",
    email: item.seller?.email || "N/A",
    amount: `PKR ${item.amount}`,
    paymentMethod: item.paymentMethod,
    status: item.status,
    createdAt: new Date(item.createdAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    originalData: item,
  }))

  // Calculate statistics
  const totalRequests = data.length
  const processingRequests = data.filter((item) => item.status === "Processing").length
  const succeededRequests = data.filter((item) => item.status === "Succeed").length
  const rejectedRequests = data.filter((item) => item.status === "Rejected").length
  const totalAmount = data.reduce((acc, item) => acc + item.amount, 0)
  const succeededAmount = data
    .filter((item) => item.status === "Succeed")
    .reduce((acc, item) => acc + item.amount, 0)

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Requests</h1>
          <p className="text-gray-600">Manage seller withdrawal requests</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Total Requests</h3>
          <p className="text-xl font-bold text-gray-900">{totalRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Processing</h3>
          <p className="text-xl font-bold text-yellow-600">{processingRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <p className="text-xl font-bold text-green-600">{succeededRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
          <p className="text-xl font-bold text-red-600">{rejectedRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
          <p className="text-xl font-bold text-blue-600">PKR {totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Paid Amount</h3>
          <p className="text-xl font-bold text-green-600">PKR {succeededAmount.toFixed(2)}</p>
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

      {/* Details Modal */}
      {detailsOpen && selectedWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Withdrawal Details</h3>
              <button 
                onClick={() => setDetailsOpen(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <RxCross1 size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="text-sm text-gray-900">{selectedWithdraw.transactionId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-sm text-gray-900 font-semibold">PKR {selectedWithdraw.amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedWithdraw.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedWithdraw.status === "Succeed" ? "bg-green-100 text-green-800" :
                      selectedWithdraw.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {selectedWithdraw.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-sm text-gray-900">{selectedWithdraw.paymentMethod}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Seller Information</label>
                <div className="mt-1 text-sm text-gray-900">
                  <p><strong>Name:</strong> {selectedWithdraw.seller?.name}</p>
                  <p><strong>Email:</strong> {selectedWithdraw.seller?.email}</p>
                  <p><strong>Phone:</strong> {selectedWithdraw.seller?.phoneNumber}</p>
                </div>
              </div>

              {selectedWithdraw.paymentMethod === "Bank Transfer" && selectedWithdraw.bankAccount && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Account Details</label>
                  <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    <p><strong>Bank:</strong> {selectedWithdraw.bankAccount.bankName}</p>
                    <p><strong>Account Title:</strong> {selectedWithdraw.bankAccount.accountTitle}</p>
                    <p><strong>Account Number:</strong> {selectedWithdraw.bankAccount.accountNumber}</p>
                    {selectedWithdraw.bankAccount.branchCode && (
                      <p><strong>Branch Code:</strong> {selectedWithdraw.bankAccount.branchCode}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedWithdraw.digitalWallet && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Digital Wallet Details</label>
                  <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    <p><strong>Wallet ID:</strong> {selectedWithdraw.digitalWallet.walletId}</p>
                    {selectedWithdraw.digitalWallet.phoneNumber && (
                      <p><strong>Phone:</strong> {selectedWithdraw.digitalWallet.phoneNumber}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Request Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedWithdraw.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedWithdraw.processedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Processed Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedWithdraw.processedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedWithdraw.adminNote && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Note</label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded">{selectedWithdraw.adminNote}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setDetailsOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {open && selectedWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Withdraw Status</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <RxCross1 size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Shop:</strong> {selectedWithdraw.seller?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Amount:</strong> PKR {selectedWithdraw.amount}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Payment Method:</strong> {selectedWithdraw.paymentMethod}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={withdrawStatus}
                  onChange={(e) => setWithdrawStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Processing">Processing</option>
                  <option value="Succeed">Approve & Complete</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Note {withdrawStatus === "Rejected" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder={
                    withdrawStatus === "Rejected" 
                      ? "Please provide a reason for rejection..." 
                      : "Optional note for the seller..."
                  }
                  required={withdrawStatus === "Rejected"}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || (withdrawStatus === "Rejected" && !adminNote.trim())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllWithdraw
