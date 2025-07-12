"use client";

import { useState } from "react";
import CreateProduct from "../../components/SellerComponent/ShopDashBoard/CreateProduct";
import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopCreateProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <DashBoardHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <DashSidebar 
          active={4} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-hidden w-full min-w-0">
          <CreateProduct />
        </div>
      </div>
    </div>
  );
}

export default ShopCreateProduct;