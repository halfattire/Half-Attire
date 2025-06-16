"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai"
import { MdRefresh } from "react-icons/md"
import Link from "next/link"
import { getAllEventsAdmin } from "@/redux/actions/event"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"

const AllEvents = () => {
  const dispatch = useDispatch()
  const { adminEvents = [], isLoading = false, error } = useSelector((state) => state.event || {})
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    fetchEvents()
  }, [dispatch])

  const fetchEvents = async () => {
    try {
      await dispatch(getAllEventsAdmin())
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Failed to fetch events")
    }
  }

  const handleRefresh = () => {
    fetchEvents()
  }

  const columns = [
    {
      field: "id",
      headerName: "Event ID",
      flex: 0.7,
      renderCell: (params) => <span className="text-blue-600 font-medium">#{params.value.slice(-8)}</span>,
    },
    {
      field: "name",
      headerName: "Event Name",
      flex: 1.2,
      renderCell: (params) => (
        <div className="flex items-center">
          <div>
            <p className="font-medium">{params.value}</p>
          </div>
        </div>
      ),
    },
    {
      field: "shop",
      headerName: "Shop",
      flex: 0.8,
      renderCell: (params) => <span className="text-gray-700">{params.value}</span>,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.6,
      renderCell: (params) => <span className="font-semibold text-green-600">{params.value}</span>,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sold",
      headerName: "Sold",
      type: "number",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "Running"
              ? "bg-green-100 text-green-800"
              : params.value === "Upcoming"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link href={`/product/${params.id}?isEvent=true`}>
            <Button size="small" variant="outlined" color="primary">
              <AiOutlineEye size={16} />
            </Button>
          </Link>
          <Button size="small" variant="outlined" color="error">
            <AiOutlineDelete size={16} />
          </Button>
        </div>
      ),
    },
  ]

  const rows = adminEvents.map((event) => ({
    id: event._id,
    name: event.name,
    shop: event.shop?.name || "Unknown Shop",
    price: `PKR ${event.discountPrice}`,
    stock: event.stock,
    sold: event.sold_out || 0,
    status:
      new Date(event.start_Date) > new Date()
        ? "Upcoming"
        : new Date(event.finish_Date) < new Date()
          ? "Ended"
          : "Running",
  }))

  // Calculate statistics
  const totalEvents = adminEvents.length
  const runningEvents = rows.filter((event) => event.status === "Running").length
  const upcomingEvents = rows.filter((event) => event.status === "Upcoming").length
  const endedEvents = rows.filter((event) => event.status === "Ended").length

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
          <p className="text-gray-600">Manage platform events and promotions</p>
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
          <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
          <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Running</h3>
          <p className="text-2xl font-bold text-green-600">{runningEvents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Upcoming</h3>
          <p className="text-2xl font-bold text-blue-600">{upcomingEvents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600">Ended</h3>
          <p className="text-2xl font-bold text-gray-600">{endedEvents}</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Events Management</h2>
          <p className="text-sm text-gray-600">View and manage all platform events</p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading events: {error}</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Events will appear here once sellers create them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllEvents
