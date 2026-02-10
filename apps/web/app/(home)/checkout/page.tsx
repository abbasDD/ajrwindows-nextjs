import CheckoutCom from "@/components/checkout/checkout-com";
import LayoutXSmall from "@/components/layout/layout-x-small";
import PublicLayout from "@/components/layout/public-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - AJR Windows",
  description: "Checkout page",
};
const CheckoutPage = () => {
  return (
    <PublicLayout>
      <LayoutXSmall className="min-h-screen">
        <CheckoutCom />
      </LayoutXSmall>
    </PublicLayout>
  );
};

export default CheckoutPage;
