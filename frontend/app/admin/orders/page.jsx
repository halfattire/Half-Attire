"use client";

import AdminDashboardOrders from "../../../components/Admin/AdminDashboardOrders";  
import { AdminProtected } from "@/app/hooks/AdminProtected"

export default function AdminDashboardOrdersPage() {
  return (
    <AdminProtected>
      <AdminDashboardOrders />
    </AdminProtected>
  );
}