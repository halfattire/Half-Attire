import UserInbox from "@/components/ProfilePageComponents/UserInbox";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Inbox() {
  return (
    <ProtectedRoute>
      <UserInbox />
    </ProtectedRoute>
  );
}