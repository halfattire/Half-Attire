import DashBoardHeader from "@/components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "@/components/SellerComponent/ShopDashBoard/DashSidebar";
import ShopAllEvents from "@/components/SellerComponent/ShopDashBoard/ShopAllEvents";

function DashAllEvents() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex">
        {/* sidebar */}
        <div>
          <DashSidebar active={5} />
        </div>
        {/* create product */}
        <div className="w-full max-w-[950px] flex-1">
          <ShopAllEvents />
        </div>
      </div>
    </div>
  );
}

export default DashAllEvents;