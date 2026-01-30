import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import CreateProductForm from "@/components/admin-dashboard/manage-product/create-product-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product - Admin Dashboard",
  description: "Admin Dashboard page",
};
const CreateProductPage = async () => {
  return (
    <div className="max-lg:px-6">
      <AdminSectionCard title={"Create New Product"}>
        <CreateProductForm />
      </AdminSectionCard>
    </div>
  );
};

export default CreateProductPage;
