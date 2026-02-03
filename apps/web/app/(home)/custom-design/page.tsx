import CustomDesignCom from "@/components/custom-design/custom-design-com";
import Room from "@/components/custom-design/room";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AJR Custom Design ",
  description:
    "A minimalist Figma clone using fabric.js and Liveblocks for real-time collaboration",
};

const Page = ({ children }: { children: React.ReactNode }) => (
  <div>
    <Room>
      <TooltipProvider>
        <CustomDesignCom />
      </TooltipProvider>
    </Room>
  </div>
);

export default Page;
