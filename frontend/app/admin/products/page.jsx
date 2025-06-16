"use client";

import AllProducts from "../../../components/Admin/AllProducts";
import { AdminProtected } from "@/app/hooks/AdminProtected"

export default function AdminDashboardProductsPage() {
  return (
    <AdminProtected>
      <AllProducts />
    </AdminProtected>
  );
}