/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";

function EventCountDown({ data }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isClient]);

  function calculateTimeLeft() {
    // Try both field names for backward compatibility
    const finishDate = data?.finish_Date || data?.Finish_Date;
    const difference = +new Date(finishDate) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const timerComponent = isClient ? Object.entries(timeLeft).map(([interval, value]) => {
    if (!value) {
      return null;
    }

    return (
      <span
        className="text-base md:text-[25px] text-[#475eda] font-semibold"
        key={interval}
      >
        {value} {interval}{" "}
      </span>
    );
  }) : <span className="text-base md:text-[25px] text-[#475eda] font-semibold">Loading...</span>;

  return (
    <div className="mt-4">
      {timerComponent.length ? (
        timerComponent
      ) : (
        <span className="text-red-600 text-lg font-semibold">Time's Up</span>
      )}
    </div>
  );
}

export default EventCountDown;