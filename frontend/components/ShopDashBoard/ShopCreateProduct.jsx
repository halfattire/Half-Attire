import CreateProduct from "../../components/SellerComponent/ShopDashBoard/CreateProduct";
import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";

function ShopCreateProduct() {
  return (
    <div>
      <DashBoardHeader />
      <div className="flex">
        {/* sidebar */}
        <div>
          <DashSidebar active={4} />
        </div>
        {/* create product */}
        <div className="w-full flex-1">
          <CreateProduct />
        </div>
      </div>
    </div>
  );
}

export default ShopCreateProduct;