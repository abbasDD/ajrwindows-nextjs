import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import UsersLists from "@/components/admin-dashboard/manage-users/users-lists";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Manage Users",
  description: "Admin Dashboard page",
};
const ManageUser = () => {
  return (
    <div className="max-lg:px-6">
      <h1 className="text-xl font-semibold my-6">Manage Users</h1>
      <div className="mb-4">
        <AdminSectionCard title="Users">
          <UsersLists />
        </AdminSectionCard>
      </div>
    </div>
  );
};

export default ManageUser;
