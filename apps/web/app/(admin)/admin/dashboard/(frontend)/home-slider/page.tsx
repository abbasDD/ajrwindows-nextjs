import AdminSectionCard from "@/components/admin-dashboard/admin-section-card";
import AddSliderModal from "@/components/admin-dashboard/frontend/home-slider/add-slider-modal";
import SliderList from "@/components/admin-dashboard/frontend/home-slider/slider-lists";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Home Slider",
  description: "Admin Dashboard page",
};
const HomeSlider = () => {
  return (
    <div className="max-xl:px-6">
      <h1 className="text-xl font-semibold my-6">Home Slider</h1>
      <AdminSectionCard title="Sliders" action={<AddSliderModal />}>
        <div>
          <SliderList />
        </div>
      </AdminSectionCard>
    </div>
  );
};

export default HomeSlider;
