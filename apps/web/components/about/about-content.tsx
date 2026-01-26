"use client";

import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { cn } from "@/lib/utils";

const AboutContent = () => {
  const { data: missionData, isLoading: mLoading } =
    useGetData<any>("about_mission");
  const { data: valuesData, isLoading: vLoading } =
    useGetData<any>("about_our_values");

  const [mImgLoaded, setMImgLoaded] = useState(false);
  const [vImgLoaded, setVImgLoaded] = useState(false);

  const mission = missionData?.[0];
  const values = valuesData?.[0];

  if (mLoading || vLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-20 py-20 px-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col md:flex-row gap-10">
            <Skeleton className="w-full md:w-5/12 aspect-[5/4] rounded-3xl bg-slate-800/40" />
            <Skeleton className="flex-1 h-64 rounded-3xl bg-slate-800/40" />
          </div>
        ))}
      </div>
    );
  }

  const sections = [
    {
      title: "Our Mission",
      data: mission,
      loaded: mImgLoaded,
      setLoaded: setMImgLoaded,
      tag: "Mission",
    },
    {
      title: "Our Values",
      data: values,
      loaded: vImgLoaded,
      setLoaded: setVImgLoaded,
      tag: "Values",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 space-y-32">
      {sections.map((section, index) => {
        if (!section.data) return null;
        const isReversed = index % 2 !== 0;

        return (
          <div key={index} className="relative w-full">
            <div
              className={cn(
                "flex flex-col items-center w-full",
                isReversed ? "md:flex-row-reverse" : "md:flex-row",
              )}
            >
              <div className="relative w-full md:w-[45%] aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4] overflow-hidden rounded-[2.5rem] shadow-2xl z-0 shrink-0">
                {!section.loaded && (
                  <Skeleton className="absolute inset-0 w-full h-full bg-card animate-pulse" />
                )}
                <img
                  src={section.data.image_url}
                  alt={section.title}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-1000",
                    section.loaded
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-110",
                  )}
                  onLoad={() => section.setLoaded(true)}
                />
                <div className="absolute inset-0 bg-card/30" />
              </div>

              <div
                className={cn(
                  "relative w-full md:w-[60%] z-10",
                  "bg-card backdrop-blur-2xl p-8 md:p-12 lg:p-16",
                  "rounded-[2rem] border border-white/5 shadow-2xl",
                  "-mt-16 md:mt-0",
                  isReversed ? "md:mr-[-10%]" : "md:ml-[-10%]",
                )}
              >
                <div className="flex flex-col space-y-6 max-w-md lg:max-w-lg">
                  <div className="space-y-2">
                    <span className="text-secondary font-mono tracking-[0.4em] text-[10px] uppercase block">
                      // {section.tag}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {section.title}
                    </h2>
                    <div className="h-[2px] w-16 bg-secondary rounded-full" />
                  </div>

                  <div
                    className={cn(
                      "text-gray-300 text-base md:text-lg leading-relaxed font-light",
                      "overflow-hidden break-words",
                      "[&_p]:mb-4 [&_p]:last:mb-0", // Handle paragraph spacing
                      "[&_span]:!text-gray-300", // Override Quill inline span colors
                    )}
                    dangerouslySetInnerHTML={{ __html: section?.data?.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AboutContent;
