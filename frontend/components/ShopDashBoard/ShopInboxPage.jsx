import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashBoardMessages from "../../components/SellerComponent/ShopDashBoard/DashBoardMessages";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopInboxPage() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex">
        {/* sidebar */}
        <div>
          <DashSidebar active={8} />
        </div>
        {/* create product */}
        <div className="w-full">
          <DashBoardMessages />
        </div>
      </div>
    </div>
  );
}

export default ShopInboxPage;