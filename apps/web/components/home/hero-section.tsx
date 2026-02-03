"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LayoutXSmall from "../layout/layout-x-small";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
    <div className="relative h-screen">
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

      <div className="pl-6 sm:pl-14 lg:pl-32 relative z-20 h-full pt-20 lg:w-1/2 flex flex-col justify-center bg-primary/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide?.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-white text-2xl sm:text-5xl xl:text-6xl font-bold leading-snug">
              {activeSlide?.title}
            </h1>

            <p className="text-white/90 text-base lg:text-xl w-[90%] ">
              {activeSlide?.description}
            </p>
            <Link href="/custom-design">
              <Button
                variant={"secondary"}
                size={"lg"}
                className="p-6 text-base font-medium"
              >
                Start Building
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <div className="flex pt-16 gap-4 text-white">
            <button
              onClick={prevSlide}
              className="border border-white size-10 grid place-items-center rounded-full hover:bg-secondary hover:border-secondary transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="border border-white size-10 grid place-items-center rounded-full hover:bg-secondary hover:border-secondary transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
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
