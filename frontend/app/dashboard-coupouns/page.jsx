import ShopCoupounsCode from "../../components/ShopDashBoard/ShopCouponsCode";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function DashboardCoupouns() {
  return (
    <SellerProtectedRoute>
      <ShopCoupounsCode />
    </SellerProtectedRoute>
  );
}