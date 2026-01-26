"use client";
import LayoutXSmall from "@/components/layout/layout-x-small";
import PublicLayout from "@/components/layout/public-layout";
import dynamic from "next/dynamic";
const PdfViewer = dynamic(() => import("@/components/catalog/pdf-viewer"), {
  ssr: false, // <- critical
});

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
