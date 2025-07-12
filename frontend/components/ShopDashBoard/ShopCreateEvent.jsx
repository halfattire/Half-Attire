"use client";

import { useState } from "react";
import CreateEvent from "../../components/SellerComponent/ShopDashBoard/CreateEvent";
import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopCreateEvent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <DashBoardHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <DashSidebar 
          active={6} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-hidden w-full min-w-0">
          <CreateEvent />
        </div>
      </div>
    </div>
  );
}

export default ShopCreateEvent;