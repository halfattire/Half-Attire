import DashAllOrders from "@/components/ShopDashBoard/DashAllOrders";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function DashboardOrders() {
  return (
    <SellerProtectedRoute>
      <DashAllOrders />
    </SellerProtectedRoute>
  );
}