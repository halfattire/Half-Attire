"use client";

import DashAllRefundOrders from "../SellerComponent/ShopDashBoard/DashAllRefundOrders";
import DashBoardHeader from "../SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../SellerComponent/ShopDashBoard/DashSidebar";
import { useState } from "react";

const DashAllRefunds = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashBoardHeader />
      <div className="flex">
        <div className="flex-shrink-0">
          <DashSidebar active={10} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="max-w-full">
            <DashAllRefundOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashAllRefunds;