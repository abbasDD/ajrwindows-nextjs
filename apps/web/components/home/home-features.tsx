import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import LayoutXSmall from "../layout/layout-x-small";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
}

const FEATURE_DATA: FeatureProps[] = [
  {
    title: "YOUR DREAM DOORS",
    description:
      "Get instant quotes, customize in real-time, and order directly from AJR",
    image: "/assets/door1.png",
    alt: "Door",
    href: "/categories",
  },
  {
    title: "YOUR DREAM WINDOWS",
    description:
      "Get instant quotes, customize in real-time, and order directly from AJR",
    image: "/assets/windowimg2.jpg",
    alt: "window",
    href: "/categories",
  },
];

const FeatureCard = ({
  title,
  description,
  image,
  alt,
  href,
}: FeatureProps) => {
  return (
    <Card className="w-full border-none flex flex-col sm:flex-row group rounded-xl overflow-hidden">
      <CardContent className="p-8 sm:w-[60%] flex flex-col justify-center space-y-4 z-10">
        <h2 className="text-xl xl:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <p className="text-sm md:text-base text-white/70 leading-relaxed">
          {description}
        </p>
        <Link
          href={href}
          className="inline-block w-fit mt-4 underline underline-offset-8 
          text-base font-semibold text-secondary hover:text-white transition-colors"
        >
          View All
        </Link>
      </CardContent>
      <div className="relative w-full sm:w-[40%] h-[260px] sm:h-auto overflow-hidden">
        <Image
          src={image}
          alt={alt}
          className="object-cover group-hover:scale-110 duration-500 transition-transform ease-in-out"
          width={180}
          height={100}
        />
      </div>
    </Card>
  );
};

export default function HomeFeatures() {
  return (
    <LayoutXSmall className="flex items-center w-full max-xl:flex-col gap-6 py-12">
      {FEATURE_DATA.map((feature, idx) => (
        <FeatureCard key={idx} {...feature} />
      ))}
    </LayoutXSmall>
  );
}
