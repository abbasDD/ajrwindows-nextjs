"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LayoutXSmall from "../layout/layout-x-small";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSlide {
  id: string | number;
  title: string;
  description: string;
  image_url: string;
  active?: boolean;
}

const FALLBACK_CONTENT: HeroSlide[] = [
  {
    id: "fallback-1",
    title: "Smart Aluminum Door Systems",
    description:
      "Upgrade your space with modern aluminum door solutions that blend durability with elegance.",
    image_url: "/hero.jpg",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const { data, isLoading } = useGetData<any>("hero_sliders");

  const slides: HeroSlide[] =
    data && data.length > 0
      ? data.filter((item: any) => item.active !== false)
      : FALLBACK_CONTENT;

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [index, slides.length]);

  if (isLoading) return <HeroSkeleton />;

  const activeSlide = slides[index];

  return (
    <LayoutXSmall className="relative h-screen ">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide?.image_url}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${activeSlide?.image_url})` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </AnimatePresence>

      <div className="absolute top-0 left-0 h-full w-full lg:w-[45%] bg-gradient-to-r from-black/80 to-transparent z-0" />

      <div className="relative z-10 h-full mx-auto flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide?.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-white max-w-4xl text-3xl sm:text-5xl lg:text-7xl font-bold leading-snug">
              {activeSlide?.title}
            </h1>

            <p className="text-white/90 text-base lg:text-2xl w-[90%] lg:w-[50%]">
              {activeSlide?.description}
            </p>

            <Button
              variant={"secondary"}
              size={"lg"}
              className="p-8 text-xl font-medium"
            >
              Start Building
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Only show if more than 1 slide */}
        {slides.length > 1 && (
          <div className="flex pt-20 gap-4 text-white">
            <button
              onClick={prevSlide}
              className="border border-white size-12 grid place-items-center rounded-full hover:bg-secondary hover:border-secondary transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="border border-white size-12 grid place-items-center rounded-full hover:bg-secondary hover:border-secondary transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </LayoutXSmall>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full bg-primary">
      <LayoutXSmall className="h-full flex flex-col justify-center space-y-6">
        <Skeleton className="h-16 w-[70%] lg:w-[50%] bg-white/10" />
        <Skeleton className="h-8 w-[50%] lg:w-[30%] bg-white/10" />
        <Skeleton className="h-24 w-[90%] lg:w-[40%] bg-white/10" />
        <Skeleton className="h-16 w-48 bg-white/10 mt-4" />
      </LayoutXSmall>
    </div>
  );
}
