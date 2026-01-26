import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import AddTestiomnialsModal from "@/components/admin-dashboard/frontend/testimonials/add-testiomnials-modal";
import TestimonialsList from "@/components/admin-dashboard/frontend/testimonials/testimonials-lists";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Home Testimonials",
  description: "Admin Dashboard page",
};
const Testimonials = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold my-6">Home Testimonials</h1>
      <AdminSectionCard title="Testimonials" action={<AddTestiomnialsModal />}>
        <div>
          <TestimonialsList />
        </div>
      </AdminSectionCard>
    </div>
  );
};

export default Testimonials;
