import ShopCreateProduct from "@/components/ShopDashBoard/ShopCreateProduct";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function DashboardCreateProduct() {
  return (
    <SellerProtectedRoute>
      <ShopCreateProduct />
    </SellerProtectedRoute>
  );
}