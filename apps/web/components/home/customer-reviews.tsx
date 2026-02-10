"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import LayoutXSmall from "../layout/layout-x-small";

export interface TestimonialsData {
  id: string;
  name: string;
  avatar: string;
  message: string;
  rating: number;
}

const CustomerReviews = () => {
  const { data, isLoading } = useGetData<TestimonialsData>("home_testiomnials");

  if (isLoading) return <ReviewLoadingSkeleton />;
  if (!data || data.length === 0) return null;

  const fillArray = (arr: TestimonialsData[], min: number) => {
    let newArr = [...arr];
    while (newArr.length < min) {
      newArr = [...newArr, ...arr];
    }
    return newArr;
  };

  const fullData = fillArray(data, 18);
  const col1 = fullData.filter((_, i) => i % 3 === 0);
  const col2 = fullData.filter((_, i) => i % 3 === 1);
  const col3 = fullData.filter((_, i) => i % 3 === 2);

  return (
    <LayoutXSmall className="w-full py-24 relative overflow-hidden">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-xl md:text-3xl xl:text-4xl font-bold text-white">
          Community Love
        </h1>
        <p className="max-w-2xl mx-auto text-sm xl:text-base text-white/50 leading-relaxed">
          Real feedback from homeowners and builders who demand the best.
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 h-[750px] overflow-hidden">
        <MarqueeColumn items={col1} duration={30} />
        <MarqueeColumn items={col2} duration={40} reverse={true} />
        <MarqueeColumn items={col3} duration={35} />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary via-primary to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary via-primary to-transparent z-20 pointer-events-none" />
      </div>
    </LayoutXSmall>
  );
};

const MarqueeColumn = ({
  items,
  duration,
  reverse = false,
}: {
  items: TestimonialsData[];
  duration: number;
  reverse?: boolean;
}) => {
  return (
    <div className="relative h-full ">
      <motion.div
        className="flex flex-col gap-8 py-4"
        initial={{ y: reverse ? "-50%" : "0%" }}
        animate={{
          y: reverse ? "0%" : "-50%",
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ willChange: "transform" }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex flex-col gap-6 p-8 rounded-[2rem] border border-white/10 hover:scale-105 transition-all duration-500 bg-white/[0.01]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative size-10 rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white font-bold text-sm tracking-tight leading-none">
                    {item.name}
                  </h4>
                </div>
              </div>

              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < (item.rating || 5)
                        ? "fill-secondary text-secondary"
                        : "text-white/10"
                    }
                  />
                ))}
              </div>
            </div>

            <p className="text-white/60 text-sm md:text-base leading-relaxed font-normal italic">
              &ldquo;{item.message}&rdquo;
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const ReviewLoadingSkeleton = () => (
  <LayoutXSmall className="py-24">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-8">
          <Skeleton className="h-64 w-full rounded-[2rem] bg-white/5 border-none" />
          <Skeleton className="h-48 w-full rounded-[2rem] bg-white/5 border-none" />
        </div>
      ))}
    </div>
  </LayoutXSmall>
);

export default CustomerReviews;
