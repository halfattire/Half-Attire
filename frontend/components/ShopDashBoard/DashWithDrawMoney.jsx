import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader"
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar"
import ShopWithDrawMoney from "../../components/SellerComponent/ShopDashBoard/ShopWithDrawMoney"

function DashWithDrawMoney() {
  return (
    <div>
    <DashBoardHeader />
    <div className="flex">
      {/* sidebar */}
      <div>
        <DashSidebar active={7} />
      </div>
      {/* create product */}
      <div className="w-full max-w-[950px] flex-1">
        <ShopWithDrawMoney />
      </div>
    </div>
  </div>
  )
}

export default DashWithDrawMoney