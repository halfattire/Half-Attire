
import DashAllRefunds from "@/components/ShopDashBoard/DashAllRefunds";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function DashboardRefunds() {
  return (
    <SellerProtectedRoute>
      <DashAllRefunds />
    </SellerProtectedRoute>
  );
}