"use client";

import { useState } from "react";
import DashBoardHeader from "../SellerComponent/ShopDashBoard/DashBoardHeader";
import DashBoardHero from "../SellerComponent/ShopDashBoard/DashBoardHero";
import DashSidebar from "../SellerComponent/ShopDashBoard/DashSidebar";

function ShopDashBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <DashBoardHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <DashSidebar 
          active={1} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-hidden w-full min-w-0">
          <DashBoardHero />
        </div>
      </div>
    </div>
  );
}

export default ShopDashBoard;