import PdfViewer from "@/components/catalog/pdf-viewer";
import LayoutXSmall from "@/components/layout/layout-x-small";
import PublicLayout from "@/components/layout/public-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog - AJR Windows",
  description: "Catalog page of AJR Windows",
};
const CatalogPage = () => {
  return (
    <PublicLayout>
      <LayoutXSmall className="min-h-screen mt-32">
        <PdfViewer />
      </LayoutXSmall>
    </PublicLayout>
  );
};

export default CatalogPage;
