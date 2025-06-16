"use client";

import AllSellers from "../../../components/Admin/AllSellers";
import { AdminProtected } from "@/app/hooks/AdminProtected"

export default function AdminDashboardSellerPage() {
  return (
    <AdminProtected>
      <AllSellers />
    </AdminProtected>
  );
}