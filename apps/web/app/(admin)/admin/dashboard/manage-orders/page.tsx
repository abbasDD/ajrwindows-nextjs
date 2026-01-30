import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import OrdersList from "@/components/admin-dashboard/manage-orders/orders-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Manage Orders",
  description: "View and manage all customer orders",
};

const ManageOrders = () => {
  return (
    <div className="max-lg:px-6">
      <h1 className="text-xl font-semibold my-6">Manage Orders</h1>
      <div className="mb-4">
        <AdminSectionCard title="Recent Orders">
          <OrdersList />
        </AdminSectionCard>
      </div>
    </div>
  );
};

export default ManageOrders;
