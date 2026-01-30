import Categories from "@/components/admin-dashboard/manage-categories/categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Manage Category",
  description: "Admin Dashboard page",
};
const ManageCateogry = () => {
  return (
    <div className="max-lg:px-6">
      <h1 className="text-xl font-semibold my-6">Manage Cateogry</h1>
      <Categories />
    </div>
  );
};

export default ManageCateogry;
