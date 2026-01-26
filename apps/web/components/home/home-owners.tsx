import React from "react";
import { Quote, Settings2, Truck, Headset, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LayoutXSmall from "../layout/layout-x-small";

interface ContentItem {
  id: number;
  title: string;
  paragraph: string;
  icon: LucideIcon;
}

const contents: ContentItem[] = [
  {
    id: 1,
    title: "Instant Online Quotes",
    paragraph: "Get real-time pricing as you design",
    icon: Quote,
  },
  {
    id: 2,
    title: "Custom Build Options",
    paragraph: "Design everything to your exact specs.",
    icon: Settings2,
  },
  {
    id: 3,
    title: "Fast Delivery",
    paragraph: "Quick local shipping & pickup options",
    icon: Truck,
  },
  {
    id: 4,
    title: "Real Support",
    paragraph: "Talk to real humans, anytime",
    icon: Headset,
  },
];

const HomeOwners = () => {
  return (
    <LayoutXSmall className="py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Why Homeowners & Builders Choose AJR
        </h2>
        <p className="max-w-4xl mx-auto text-base md:text-lg text-white/60 leading-relaxed">
          Get instant, transparent quotes, explore flexible customization
          options in real time, and conveniently place your order directly with
          AJR all through a streamlined and hassle-free online experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {contents.map((item) => (
          <FeatureCard key={item.id} item={item} />
        ))}
      </div>
    </LayoutXSmall>
  );
};

const FeatureCard = ({ item }: { item: ContentItem }) => {
  const Icon = item.icon;

  return (
    <Card className="border-none group transition-all duration-300 rounded-2xl overflow-hidden">
      <CardContent className="p-8 space-y-12">
        <Icon className="size-8 text-secondary group-hover:scale-125 transition-all duration-300" />

        <div className="space-y-2">
          <h3 className="text-xl uppercase font-semibold text-secondary">
            {item.title}
          </h3>
          <p className="text-white/80 leading-snug">{item.paragraph}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeOwners;
