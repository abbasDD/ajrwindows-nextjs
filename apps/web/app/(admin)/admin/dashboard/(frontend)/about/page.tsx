import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import OurMission from "@/components/admin-dashboard/frontend/about/our-mission";
import OurValues from "@/components/admin-dashboard/frontend/about/our-values";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Home About",
  description: "Admin Dashboard page",
};
const About = () => {
  return (
    <div className="max-lg:px-6">
      <h1 className="text-xl font-semibold my-6">About Page</h1>
      <div className="mb-4">
        <AdminSectionCard title="Our Mission">
          <OurMission />
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="Our Values">
        <OurValues />
      </AdminSectionCard>
    </div>
  );
};

export default About;
