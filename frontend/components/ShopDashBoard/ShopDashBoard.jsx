"use client";

import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashBoardHero from "../../components/SellerComponent/ShopDashBoard/DashBoardHero";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopDashBoard() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex">
        <div>
          <DashSidebar active={1} />
        </div>
        <DashBoardHero />
      </div>
    </div>
  );
}

export default ShopDashBoard;