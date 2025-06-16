
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";
import DashAllProducts from "../../components/ShopDashBoard/DashAllProducts";

export default function DashboardProducts() {
  return (
    <SellerProtectedRoute>
      <DashAllProducts />
    </SellerProtectedRoute>
  );
}