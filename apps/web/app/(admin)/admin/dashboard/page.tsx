import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import UserStatics from "@/components/admin-dashboard/dashboard/users-statics";
import UsersLists from "@/components/admin-dashboard/manage-users/users-lists";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Admin Dashboard",
  description: "Admin Dashboard page",
};
const AdminDashboard = () => {
  return (
    <>
      <h1 className="text-xl font-semibold my-6">Admin Dashboard</h1>
      <UserStatics />
      <div className="my-4">
        <AdminSectionCard title="All Users">
          <UsersLists />
        </AdminSectionCard>
      </div>
    </>
  );
};

export default AdminDashboard;
