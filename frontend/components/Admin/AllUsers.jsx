"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai"
import { RxCross1 } from "react-icons/rx"
import { MdRefresh } from "react-icons/md"
import { getAllUsersAdmin } from "@/redux/actions/user"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"
import axios from "axios"
import { server } from "../../lib/server"

const AllUsers = () => {
  const dispatch = useDispatch()
  const { adminUsers = [], isLoading = false, error } = useSelector((state) => state.user || {})
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState("")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    fetchUsers()
  }, [dispatch])

  const fetchUsers = async () => {
    try {
      await dispatch(getAllUsersAdmin())
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    }
  }

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${server}/user/admin-delete-user/${id}`, {
        withCredentials: true,
      })
      toast.success(response.data.message)
      await fetchUsers() // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user")
    }
    setOpen(false)
  }

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      flex: 0.7,
      renderCell: (params) => <span className="text-blue-600 font-medium">#{params.value.slice(-8)}</span>,
    },
    {
      field: "avatar",
      headerName: "Avatar",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-center">
          <img
            src={params.value || "/fallback-avatar.png"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
      renderCell: (params) => <span className="text-gray-600">{params.value}</span>,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.6,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "admin"
              ? "bg-red-100 text-red-800"
              : params.value === "seller"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "joinedAt",
      headerName: "Joined Date",
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button size="small" variant="outlined" color="primary">
            <AiOutlineEye size={16} />
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => {
              setUserId(params.id)
              setOpen(true)
            }}
          >
            <AiOutlineDelete size={16} />
          </Button>
        </div>
      ),
    },
  ]

  const rows = adminUsers.map((user) => ({
    id: user._id,
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    role: user.role,
    joinedAt: new Date(user.createdAt).toLocaleDateString(),
  }))

  // Calculate statistics
  const totalUsers = adminUsers.length
  const adminCount = adminUsers.filter((user) => user.role === "admin").length
  const sellerCount = adminUsers.filter((user) => user.role === "seller").length
  const customerCount = adminUsers.filter((user) => user.role === "user").length

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <p className="text-gray-600">Manage platform users and their roles</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <MdRefresh className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Customers</h3>
          <p className="text-2xl font-bold text-green-600">{customerCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Sellers</h3>
          <p className="text-2xl font-bold text-blue-600">{sellerCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Admins</h3>
          <p className="text-2xl font-bold text-red-600">{adminCount}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
          <p className="text-sm text-gray-600">View and manage all platform users</p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading users: {error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Users will appear here once they register</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <RxCross1 size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(userId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllUsers
