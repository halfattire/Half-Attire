import Footer from "../../components/Footer";
import OrderDetails from "../../components/SellerComponent/OrderDetails";
import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";

function ShopOrderDetails() {
  return (
    <div>
      <DashBoardHeader />
      <OrderDetails/>
      <Footer/>
    </div>
  );
}

export default ShopOrderDetails;
