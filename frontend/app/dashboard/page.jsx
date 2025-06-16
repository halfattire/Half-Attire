import ShopDashBoard from "@/components/ShopDashBoard/ShopDashBoard";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function Dashboard() {
  return (
    <SellerProtectedRoute>
      <ShopDashBoard />
    </SellerProtectedRoute>
  );
}