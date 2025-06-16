import DashWithDrawMoney from "@/components/ShopDashBoard/DashWithDrawMoney";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function DashboardWithdrawMoney() {
  return (
    <SellerProtectedRoute>
      <DashWithDrawMoney />
    </SellerProtectedRoute>
  );
}