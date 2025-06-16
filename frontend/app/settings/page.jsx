import ShopSettingPage from "@/components/ShopPages/ShopSettingPage";
import SellerProtectedRoute from "@/components/ShopPages/SellerProtectedRoute";

export default function Settings() {
  return (
    <SellerProtectedRoute>
      <ShopSettingPage />
    </SellerProtectedRoute>
  );
}