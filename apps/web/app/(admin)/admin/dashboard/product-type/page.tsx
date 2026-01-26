import ProductType from "@/components/admin-dashboard/product-type/product-type";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Product Type",
  description: "Admin Dashboard page",
};
const Page = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold my-6">Product Type</h1>
      <ProductType />
    </div>
  );
};

export default Page;
