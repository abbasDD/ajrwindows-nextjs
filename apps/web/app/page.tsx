import CustomerReviews from "@/components/home/customer-reviews";
import DesignYourOwn from "@/components/home/design-your-own";
import Ecatalog from "@/components/home/e-catalog";
import HeroSection from "@/components/home/hero-section";
import HomeFeatures from "@/components/home/home-features";
import HomeOwners from "@/components/home/home-owners";
import OurProducts from "@/components/home/our-products";
import Projects from "@/components/home/projects";
import PublicLayout from "@/components/layout/public-layout";

const Home = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <HomeFeatures />
      <OurProducts />
      <DesignYourOwn />
      <HomeOwners />
      <Projects />
      <CustomerReviews />
      <Ecatalog />
    </PublicLayout>
  );
};

export default Home;
