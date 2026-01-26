import AdminSidebar from "@/components/layout/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - AJR Windows",
  description: "Admin Dashboard page",
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <section className="flex gap-6 w-full">
        <AdminSidebar />
        <div className="flex-1 py-6 max-w-7xl  mx-auto">
          <SidebarTrigger />
          {children}
        </div>
      </section>
    </SidebarProvider>
  );
}
