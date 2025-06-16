"use client"
import EventCard from "./EventCard";
import { useSelector } from "react-redux";

function Events() {
  const { allEvents } = useSelector((state) => state.events);

  return (
    <div>
      <div className="section">
        <h1 className="heading">Popular Events</h1>
        <div className="mb-12 w-full">
          <EventCard data={allEvents && allEvents[0]} />
        </div>
      </div>
    </div>
  );
}

export default Events;
