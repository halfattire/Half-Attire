"use client";

import AllUsers from "../../../components/Admin/AllUsers";
import { AdminProtected } from "@/app/hooks/AdminProtected"

export default function AdminDashboardUsersPage() {
  return (
    <AdminProtected>
      <AllUsers />
    </AdminProtected>
  );
}