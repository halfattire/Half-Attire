import ShopInboxPage from "@/components/ShopDashBoard/ShopInboxPage";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function DashboardMessages() {
  return (
    <SellerProtectedRoute>
      <ShopInboxPage />
    </SellerProtectedRoute>
  );
}