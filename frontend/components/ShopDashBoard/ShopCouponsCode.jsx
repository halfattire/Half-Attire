import AllCoupons from "../../components/SellerComponent/ShopDashBoard/AllCoupons";
import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopCoupounsCode() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashBoardHeader />
      <div className="flex flex-col lg:flex-row">
        {/* sidebar */}
        <div className="lg:block">
          <DashSidebar active={9} />
        </div>
        {/* create coupouns code */}
        <div className="w-full max-w-none lg:max-w-[950px] flex-1 px-2 lg:px-4">
          <AllCoupons />
        </div>
      </div>
    </div>
  );
}

export default ShopCoupounsCode;