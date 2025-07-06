"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../redux/actions/event";
import EventCard from "./EventCard";
import Header from "./Header";
import Footer from "./Footer";
import NewsLetter from "./NewsLetter";
import Loader from "./Loader";

const AllEventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading, error } = useSelector((state) => state.events);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (allEvents) {
      let filtered = allEvents;
      const now = new Date();

      // Filter by status
      if (filter === "running") {
        filtered = filtered.filter(event => {
          const startDate = new Date(event.start_Date);
          const endDate = new Date(event.finish_Date);
          return startDate <= now && endDate >= now;
        });
      } else if (filter === "upcoming") {
        filtered = filtered.filter(event => {
          const startDate = new Date(event.start_Date);
          return startDate > now;
        });
      } else if (filter === "ended") {
        filtered = filtered.filter(event => {
          const endDate = new Date(event.finish_Date);
          return endDate < now;
        });
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(event =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(filtered);
    }
  }, [allEvents, filter, searchTerm]);

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.start_Date);
    const endDate = new Date(event.finish_Date);

    if (startDate > now) return "upcoming";
    if (endDate < now) return "ended";
    return "running";
  };

  const getEventCounts = () => {
    if (!allEvents) return { all: 0, running: 0, upcoming: 0, ended: 0 };
    
    const now = new Date();
    const counts = { all: allEvents.length, running: 0, upcoming: 0, ended: 0 };
    
    allEvents.forEach(event => {
      const status = getEventStatus(event);
      counts[status]++;
    });
    
    return counts;
  };

  const eventCounts = getEventCounts();

  return (
    <div>
      <Header />
      
      <div className="section">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
            <p className="text-gray-600">Discover amazing deals and exclusive events</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
              <p className="text-2xl font-bold text-blue-600">{eventCounts.all}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Running</h3>
              <p className="text-2xl font-bold text-green-600">{eventCounts.running}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Upcoming</h3>
              <p className="text-2xl font-bold text-blue-600">{eventCounts.upcoming}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600">Ended</h3>
              <p className="text-2xl font-bold text-gray-600">{eventCounts.ended}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Events ({eventCounts.all})
                </button>
                <button
                  onClick={() => setFilter("running")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "running"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Running ({eventCounts.running})
                </button>
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "upcoming"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Upcoming ({eventCounts.upcoming})
                </button>
                <button
                  onClick={() => setFilter("ended")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "ended"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Ended ({eventCounts.ended})
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">Error loading events</p>
                  <p className="text-sm text-gray-600 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(getAllEvents())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid gap-6">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="relative">
                    <EventCard data={event} />
                    {/* Event Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getEventStatus(event) === "running"
                            ? "bg-green-100 text-green-800"
                            : getEventStatus(event) === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getEventStatus(event) === "running"
                          ? "🔴 Live"
                          : getEventStatus(event) === "upcoming"
                          ? "🔵 Upcoming"
                          : "⚫ Ended"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">No events found</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {searchTerm
                      ? `No events match your search "${searchTerm}"`
                      : filter === "all"
                      ? "No events are currently available"
                      : `No ${filter} events found`}
                  </p>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <NewsLetter />
      <Footer />
    </div>
  );
};

export default AllEventsPage;
