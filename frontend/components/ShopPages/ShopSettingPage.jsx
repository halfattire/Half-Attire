import DashBoardHeader from "../SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../SellerComponent/ShopDashBoard/DashSidebar";
import ShopSetting from "../SellerComponent/ShopSetting";

function ShopSettingPage() {
  return (
    <div>
      <DashBoardHeader />
     <div className="flex">
     <div>
        <DashSidebar active={11} />
      </div>
      <ShopSetting />
     </div>
    </div>
  );
}

export default ShopSettingPage;
