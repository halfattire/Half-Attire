"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataGrid } from "@mui/x-data-grid"
import { Button } from "@mui/material"
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai"
import { MdRefresh } from "react-icons/md"
import Link from "next/link"
import { getAllEventsAdmin, deleteEventAdmin } from "@/redux/actions/event"
import { server } from "@/lib/server"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"

const AllEvents = () => {
  const dispatch = useDispatch()
  const { adminEvents = [], isLoading = false, error } = useSelector((state) => state.events || {})
  const { user } = useSelector((state) => state.user)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [deleteLoading, setDeleteLoading] = useState(null)

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

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    setDeleteLoading(eventId)
    try {
      const result = await dispatch(deleteEventAdmin(eventId))
      if (result.success) {
        toast.success("Event deleted successfully")
        await fetchEvents() // Refresh the events list
      } else {
        toast.error(result.error || "Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    } finally {
      setDeleteLoading(null)
    }
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
            <Button size="small" variant="outlined" color="primary" title="View Event">
              <AiOutlineEye size={16} />
            </Button>
          </Link>
          <Button 
            size="small" 
            variant="outlined" 
            color="error"
            onClick={() => handleDeleteEvent(params.id)}
            disabled={deleteLoading === params.id}
            title="Delete Event"
          >
            {deleteLoading === params.id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <AiOutlineDelete size={16} />
            )}
          </Button>
        </div>
      ),
    },
  ]

  const rows = adminEvents.map((event) => {
    const now = new Date();
    const startDate = new Date(event.start_Date);
    const finishDate = new Date(event.finish_Date);
    
    let status;
    if (startDate > now) {
      status = "Upcoming";
    } else if (finishDate < now) {
      status = "Ended";
    } else {
      status = "Running";
    }
    
    // Extract shop name with comprehensive fallback logic
    let shopName = "Unknown Shop";
    
    try {
      // Priority 1: Check if shop object has name
      if (event.shop && event.shop.name && event.shop.name.trim() !== "") {
        shopName = event.shop.name;
      }
      // Priority 2: Check if shop is a string
      else if (typeof event.shop === 'string' && event.shop.trim() !== "") {
        shopName = event.shop;
      }
      // Priority 3: Check if shopId populated object has name (from MongoDB populate)
      else if (event.shopId && typeof event.shopId === 'object' && event.shopId.name) {
        shopName = event.shopId.name;
      }
      // Priority 4: Use shopId to create a display name
      else if (event.shopId) {
        const shopIdStr = typeof event.shopId === 'object' ? event.shopId.toString() : event.shopId;
        shopName = `Shop ${shopIdStr.slice(-6)}`;
      }
      // Priority 5: Use shop._id to create a display name
      else if (event.shop && event.shop._id) {
        shopName = `Shop ${event.shop._id.toString().slice(-6)}`;
      }
      // Priority 6: Try to extract from any other available data
      else {
        if (event.shop && event.shop.email) {
          shopName = `Shop (${event.shop.email.split('@')[0]})`;
        } else if (event.shop && event.shop.address) {
          shopName = `Shop (${event.shop.address.substring(0, 15)}...)`;
        }
      }
    } catch (error) {
      console.log(`Error processing shop name for event ${event._id}:`, error);
      shopName = "Unknown Shop";
    }
    
    return {
      id: event._id,
      name: event.name,
      shop: shopName,
      price: `PKR ${event.discountPrice}`,
      stock: event.stock,
      sold: event.sold_out || 0,
      status: status,
    };
  })

  // Calculate statistics
  const totalEvents = adminEvents.length
  const runningEvents = rows.filter((event) => event.status === "Running").length
  const upcomingEvents = rows.filter((event) => event.status === "Upcoming").length
  const endedEvents = rows.filter((event) => event.status === "Ended").length

  return (
    <div className="w-full p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Events</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage platform events and promotions</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm justify-center"
          >
            <MdRefresh className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Events</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalEvents}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Running</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{runningEvents}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Upcoming</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{upcomingEvents}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600">Ended</h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600">{endedEvents}</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Events Management</h2>
          <p className="text-xs sm:text-sm text-gray-600">View and manage all platform events</p>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32 sm:h-48 lg:h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-red-600 mb-4 text-sm sm:text-base">Error loading events: {error}</p>
              <button
                onClick={handleRefresh}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          ) : rows.length > 0 ? (
            <div className="overflow-x-auto">
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
          ) : (
            <div className="text-center py-8 sm:py-12">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 text-sm sm:text-base px-4">Events will appear here once sellers create them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllEvents
