import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import PersonalDetails from "@/components/admin-dashboard/frontend/settings/personal-details";
import SocialLinks from "@/components/admin-dashboard/frontend/settings/social-links";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Home Settings",
  description: "Admin Dashboard page",
};
const Settings = () => {
  return (
    <>
      <h1 className="text-xl font-semibold my-6">Settings Page</h1>
      <AdminSectionCard title="Settings">
        <Tabs defaultValue="personal-details">
          <TabsList className="mb-2">
            <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
            <TabsTrigger value="social-links">Social Links</TabsTrigger>
          </TabsList>
          <TabsContent value="personal-details">
            <PersonalDetails />
          </TabsContent>
          <TabsContent value="social-links">
            <SocialLinks />
          </TabsContent>
        </Tabs>
      </AdminSectionCard>
    </>
  );
};

export default Settings;
