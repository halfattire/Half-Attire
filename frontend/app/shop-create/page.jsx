
import ProtectedRoute from "@/components/ProtectedRoute";
import ShopCreate from "../../components/ShopPages/ShopCreate";

export default function Payment() {
  return (
    <ProtectedRoute>
      <ShopCreate />
    </ProtectedRoute>
  );
}