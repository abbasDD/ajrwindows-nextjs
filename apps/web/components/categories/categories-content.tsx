"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";

const images = ["/catdoor.png", "/catwindow.png"];

const CategoriesContent = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="rounded-3xl!">
      <CardContent className="sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
        <div className="flex-1 text-center md:text-left space-y-6 z-10">
          <div className="space-y-3 w-full">
            <motion.h2
              initial={{ y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-secondary text-sm  font-bold uppercase tracking-[0.2em]"
            >
              Choose What You Want
            </motion.h2>
            <motion.h1
              initial={{ y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-4xl  font-bold text-white  leading-snug"
            >
              Categories Related to Items
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-sm md:text-lg text-white/50 leading-relaxed font-medium"
          >
            At AJR, we offer a comprehensive range of doors and windows to suit
            every need. From classic wooden doors to sleek glass windows, our
            collection has it all. We provide high-quality, durable, and stylish
            solutions to enhance your space.
          </motion.p>
        </div>
        <div className="relative w-full max-w-[400px] aspect-[4/5] overflow-hidden rounded-3xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-full h-full"
            >
              <Image
                src={images[index] as string}
                alt="Category Preview"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.3)] pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesContent;
