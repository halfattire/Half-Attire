import OrderDetailPage from "@/components/OrderDetailPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrderDetailPageWrapper({ params }) {
  return (
    <ProtectedRoute>
    <OrderDetailPage orderId={params.id} />;
    </ProtectedRoute>
  );
}