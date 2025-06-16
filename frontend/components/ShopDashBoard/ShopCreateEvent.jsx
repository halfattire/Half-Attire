import CreateEvent from "../../components/SellerComponent/ShopDashBoard/CreateEvent";
import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopCreateEvent() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex">
        {/* sidebar */}
        <div>
          <DashSidebar active={6} />
        </div>
        {/* create event */}
        <div className="w-full max-w-[950px] flex-1">
          <CreateEvent />
        </div>
      </div>
    </div>
  );
}

export default ShopCreateEvent;