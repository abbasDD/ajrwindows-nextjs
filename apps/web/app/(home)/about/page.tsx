import AboutContent from "@/components/about/about-content";
import LayoutXLarge from "@/components/layout/layout-x-large";
import PublicLayout from "@/components/layout/public-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - AJR Windows",
  description: "About Us page",
};
const AboutPage = () => {
  return (
    <PublicLayout>
      <LayoutXLarge className="min-h-screen mt-32">
        <h1 className="text-5xl font-serif py-12 font-semibold text-secondary text-center">
          About Us
        </h1>
        <AboutContent />
      </LayoutXLarge>
    </PublicLayout>
  );
};

export default AboutPage;
