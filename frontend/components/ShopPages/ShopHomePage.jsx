"use client"; // Added because of useEffect

import { useEffect } from "react";
import ShopInfo from "@/components/SellerComponent/ShopInfo";
import ShopProfileData from "@/components/SellerComponent/ShopProfileData";

function ShopHomePage({ id }) { // Added id prop for dynamic route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Updated to use smooth scrolling for better UX
  }, []);

  return (
    <div className="section bg-gray-100 py-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="custom-scrollbar top-4 z-10 lg:h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg lg:sticky lg:w-80">
          <ShopInfo isOwner={true} shopId={id} /> {/* Passed id prop */}
        </div>
        <div className="flex-1 lg:px-6 py-6 lg:py-0">
          <ShopProfileData isOwner={true} shopId={id} /> {/* Passed id prop */}
        </div>
      </div>
    </div>
  );
}

export default ShopHomePage;