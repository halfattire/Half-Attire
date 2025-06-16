import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader"
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar"
import ShopAllOrders from "../../components/SellerComponent/ShopDashBoard/ShopAllOrders"

function DashAllOrders() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex">
        {/* sidebar */}
        <div>
          <DashSidebar active={2} />
        </div>
        {/* create product */}
        <div className="w-full max-w-[950px] flex-1">
          <ShopAllOrders />
        </div>
      </div>
    </div>
  )
}

export default DashAllOrders