import CustomDesignCom from "@/components/custom-design/custom-design-com";
import Room from "@/components/custom-design/room";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AJR Custom Design ",
  description: "Ajr custom design page",
};

const Page = () => (
  <div>
    <Room>
      <TooltipProvider>
        <CustomDesignCom />
      </TooltipProvider>
    </Room>
  </div>
);

export default Page;
