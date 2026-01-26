import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import QueriesLists from "@/components/admin-dashboard/manage-queries/queries-lists";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Manage Queries",
  description: "Admin Dashboard page",
};
const ManageQueries = () => {
  return (
    <>
      <h1 className="text-xl font-semibold my-6">Manage Queries</h1>
      <div className="mb-4">
        <AdminSectionCard title="Queries">
          <QueriesLists />
        </AdminSectionCard>
      </div>
    </>
  );
};

export default ManageQueries;
