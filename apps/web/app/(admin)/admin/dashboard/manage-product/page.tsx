import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import ProductList from "@/components/admin-dashboard/manage-product/product-lists";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Admin Dashboard page",
};
const ManageProduct = () => {
  return (
    <>
      <h1 className="text-xl font-semibold my-6"> All Products</h1>
      <div className="mb-4">
        <AdminSectionCard
          title="Products"
          action={
            <Link
              href={"./manage-product/create"}
              className="py-2 px-8 bg-secondary text-black rounded-xl hover:opacity-85"
            >
              Add Product
            </Link>
          }
        >
          <ProductList />
        </AdminSectionCard>
      </div>
    </>
  );
};

export default ManageProduct;
