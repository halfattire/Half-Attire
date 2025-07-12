"use client";

import { useState } from "react";

function ShopDashBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div>Dashboard Test</div>
    </div>
  );
}

export default ShopDashBoard;
