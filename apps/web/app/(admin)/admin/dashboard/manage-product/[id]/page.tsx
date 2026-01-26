import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import CreateProductForm from "@/components/admin-dashboard/manage-product/create-product-client";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}
export const metadata: Metadata = {
  title: "Update Product - Admin Dashboard",
  description: "Admin Dashboard page",
};
const CreateProductPage = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <AdminSectionCard title={"Edit Product"}>
      <CreateProductForm productId={id} />
    </AdminSectionCard>
  );
};

export default CreateProductPage;
