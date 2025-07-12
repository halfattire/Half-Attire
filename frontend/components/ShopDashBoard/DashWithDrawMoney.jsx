"use client";

import { useState } from "react";
import DashBoardHeader from "../SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../SellerComponent/ShopDashBoard/DashSidebar";
import ShopWithDrawMoney from "../SellerComponent/ShopDashBoard/ShopWithDrawMoney";

function DashWithDrawMoney() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <DashBoardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashSidebar active={7} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Content Area */}
        <div className="flex-1 lg:ml-0">
          <ShopWithDrawMoney />
        </div>
      </div>
    </div>
  );
}

export default DashWithDrawMoney;