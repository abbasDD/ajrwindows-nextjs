import ContactForm from "@/components/contact/contact-form";
import LayoutXSmall from "@/components/layout/layout-x-small";
import PublicLayout from "@/components/layout/public-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - AJR Windows",
  description: "Contact Us page",
};
const ContactPage = () => {
  return (
    <PublicLayout>
      <LayoutXSmall className="min-h-screen mt-40">
        <ContactForm />
      </LayoutXSmall>
    </PublicLayout>
  );
};

export default ContactPage;
