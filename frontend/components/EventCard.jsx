"use client";

import Link from "next/link";
import Image from "next/image";
import { backend_url } from "../lib/server";
import EventCountDown from "./EventCountDown";

// Props:
// - data: Object containing event details (_id, images, name, description, originalPrice, discountPrice, sold_out, Finish_Date)
function EventCard({ data }) {
  return (
    <div className="items-center justify-between gap-6 rounded-lg bg-white p-8 px-6 shadow-sm md:px-12 lg:flex">
      <div className="flex w-full items-center justify-center lg:w-2/5">
        <Image
          className="w-full max-w-sm object-contain lg:w-[80%]"
          src={
            data?.images && data.images.length > 0
              ? `${backend_url}/${data.images[0]}`
              : "/assets/placeholder.png"
          }
          alt={data?.name || "Event Image"}
          width={384} // max-w-sm = ~384px
          height={384} // Assuming square aspect ratio; adjust if needed
        />
      </div>
      <div className="flex w-full flex-col justify-center py-8 lg:w-3/5">
        <h2 className="text-[25px] font-[600] text-[#333]">
          {data?.name || "Unknown Event"}
        </h2>
        <p>{data?.description || "No description available"}</p>
        <div className="flex justify-between py-2">
          <div className="flex items-center">
            <h5 className="pr-3 text-lg font-medium text-[#d55b45] line-through">
              {data?.originalPrice ? `${data.originalPrice}PKR ` : ""}
            </h5>
            <h5 className="pr-3 text-[20px] font-bold text-[#333]">
              {data?.discountPrice ? `${data.discountPrice}PKR` : data?.originalPrice ? `${data.originalPrice}PKR` : "0 PKR"}
            </h5>
          </div>
          <div className="pr-3 text-[17px] font-normal text-[#44a55e]">
            {data?.sold_out || 0} sold
          </div>
        </div>
        <EventCountDown data={data} />
        <div className="mb-4"></div>
        <div className="">
          <Link href={`/product/${data?._id}?isEvent=true`}>
            <button className="inline-block cursor-pointer rounded-md bg-indigo-900 px-6 py-2 text-white">
              See Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;