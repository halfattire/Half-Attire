"use client";

import PaymentPage from "@/components/PaymentPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Payment() {
  return (
    <ProtectedRoute>
      <PaymentPage />
    </ProtectedRoute>
  );
}