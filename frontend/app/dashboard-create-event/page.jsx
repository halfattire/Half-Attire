import ShopCreateEvent from "@/components/ShopDashBoard/ShopCreateEvent";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function DashboardCreateEvent() {
  return (
    <SellerProtectedRoute>
      <ShopCreateEvent />
    </SellerProtectedRoute>
  );
}