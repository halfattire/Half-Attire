import AllCoupons from "../../components/SellerComponent/ShopDashBoard/AllCoupons";
import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopCoupounsCode() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex">
        {/* sidebar */}
        <div>
          <DashSidebar active={9} />
        </div>
        {/* create coupouns code */}
        <div className="w-full max-w-[950px] flex-1">
          <AllCoupons />
        </div>
      </div>
    </div>
  );
}

export default ShopCoupounsCode;