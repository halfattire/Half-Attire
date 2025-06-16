"use client";

import AllWithdraw from "../../../components/Admin/AllWithdraw";
import { AdminProtected } from "@/app/hooks/AdminProtected"

export default function AdminDashboardWithdrawPage() {
  return (
    <AdminProtected>
      <AllWithdraw />
    </AdminProtected>
  );
}