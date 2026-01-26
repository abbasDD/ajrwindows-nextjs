import CategoriesContent from "@/components/categories/categories-content";
import CategoryBrowser from "@/components/categories/category-browser";
import LayoutXSmall from "@/components/layout/layout-x-small";
import PublicLayout from "@/components/layout/public-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - AJR Windows",
  description: "Categories page of AJR Windows",
};
const CategoriesPage = () => {
  return (
    <PublicLayout>
      <LayoutXSmall className="min-h-screen mt-32">
        <CategoriesContent />
        <CategoryBrowser />
      </LayoutXSmall>
    </PublicLayout>
  );
};

export default CategoriesPage;
