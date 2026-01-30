import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import PaymentSettingsForm from "@/components/admin-dashboard/payment-settings/payment-settings-forms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Payment Settings",
  description: "Admin Dashboard page",
};
const ManagePromoCode = () => {
  return (
    <div className="max-lg:px-6">
      <h1 className="text-xl font-semibold my-6">Payment Settings Form</h1>
      <div className="mb-4">
        <AdminSectionCard title="">
          <PaymentSettingsForm />
        </AdminSectionCard>
      </div>
    </div>
  );
};

export default ManagePromoCode;
