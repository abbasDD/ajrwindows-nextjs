import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import { PromoCodeDialog } from "@/components/admin-dashboard/manage-promo-code/promo-code-dialog";
import PromoCodeList from "@/components/admin-dashboard/manage-promo-code/promo-code-lists";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Manage Promo Code",
  description: "Admin Dashboard page",
};
const ManagePromoCode = () => {
  return (
    <>
      <h1 className="text-xl font-semibold my-6">Manage Promo Code</h1>
      <div className="mb-4">
        <AdminSectionCard title="Promo Codes" action={<PromoCodeDialog />}>
          <PromoCodeList />
        </AdminSectionCard>
      </div>
    </>
  );
};

export default ManagePromoCode;
