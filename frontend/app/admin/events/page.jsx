"use client";

import AllEvents from "../../../components/Admin/AllEvents";
import { AdminProtected } from "@/app/hooks/AdminProtected"

export default function AdminDashboardEventsPage() {
  return (
    <AdminProtected>
      <AllEvents />
    </AdminProtected>
  );
}