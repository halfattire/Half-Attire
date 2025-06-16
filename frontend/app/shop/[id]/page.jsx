import ShopHomePage from "@/components/ShopPages/ShopHomePage";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function ShopHome() {
  return (
    <SellerProtectedRoute>
      <ShopHomePage />
    </SellerProtectedRoute>
  );
}