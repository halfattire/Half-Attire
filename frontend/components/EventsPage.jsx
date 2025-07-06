"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../redux/actions/event";
import EventCard from "./EventCard";
import Header from "./Header";
import Footer from "./Footer";
import NewsLetter from "./NewsLetter";
import Loader from "./Loader";

const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  // Filter running events
  const runningEvents = allEvents?.filter(event => {
    const now = new Date();
    const startDate = new Date(event.start_Date);
    const endDate = new Date(event.finish_Date);
    return startDate <= now && endDate >= now;
  }) || [];

  // Filter upcoming events
  const upcomingEvents = allEvents?.filter(event => {
    const now = new Date();
    const startDate = new Date(event.start_Date);
    return startDate > now;
  }) || [];

  return (
    <div>
      <Header />
      
      <div className="section">
        <div className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
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
          )}

          {/* Events Content */}
          {!isLoading && !error && (
            <>
              {/* Running Events */}
              {runningEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="heading text-green-600">🔴 Live Events</h2>
                  <div className="space-y-6">
                    {runningEvents.map((event) => (
                      <EventCard key={event._id} data={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="heading text-blue-600">🔵 Upcoming Events</h2>
                  <div className="space-y-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event._id} data={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Events */}
              {allEvents && allEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="heading">All Events</h2>
                  <div className="space-y-6">
                    {allEvents.map((event) => (
                      <EventCard key={event._id} data={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* No Events */}
              {(!allEvents || allEvents.length === 0) && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium">No events found</p>
                    <p className="text-sm text-gray-600 mt-1">Check back later for new events</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;