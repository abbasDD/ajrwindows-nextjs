"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const designContents = [
  {
    id: 1,
    title: "Choose",
    paragraph: "Browse our extensive collection of styles",
  },
  {
    id: 2,
    title: "Customization",
    paragraph: "Get real-time pricing as you design",
  },
  {
    id: 3,
    title: "Preview",
    paragraph: "See your creation in high-definition 3D",
  },
  {
    id: 4,
    title: "Quote",
    paragraph: "Receive a detailed breakdown instantly",
  },
  { id: 5, title: "Order", paragraph: "Secure your build with a simple click" },
];

const DesignYourOwn = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          videoEl.play().catch(() => {
            console.log("Autoplay prevented");
          });
          setIsPlaying(true);
        } else {
          videoEl.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, []);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent trigger multiple times if nested
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const showButton = !isPlaying || isHovering;

  return (
    <Card className="bg-card my-16 border-none overflow-hidden flex flex-col md:flex-row md:h-[650px] rounded-none shadow-none p-0">
      <div className="flex-1 py-12 px-8 sm:px-12 lg:px-20 flex flex-col justify-center">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Design Your Own
          </h2>
          <p className="mt-4 mb-12 text-white/60 text-lg leading-relaxed">
            Experience the future of home improvement. Get instant quotes,
            customize in real-time, and order directly from AJR.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {designContents.map((content, index) => (
              <div key={content.id} className="group space-y-3">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-secondary text-primary rounded-xl font-bold grid place-items-center shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>
                  <h3 className="text-sm uppercase tracking-[0.1em] text-secondary font-bold">
                    {content.title}
                  </h3>
                </div>
                <p className="text-white/80 text-sm leading-snug pl-1">
                  {content.paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="w-full md:w-[45%] lg:w-[50%] bg-neutral-900 relative cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handlePlayPause}
      >
        <video
          src="/assets/room_video.mp4"
          className="w-full h-full object-cover opacity-80"
          controls={false}
          ref={videoRef}
          muted
          loop
          playsInline
          onEnded={() => setIsPlaying(false)}
        />

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-500 bg-black/20",
            showButton ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="size-20 border-2 border-white/40 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group">
            {isPlaying ? (
              <Pause className="text-white fill-white size-8" />
            ) : (
              <Play className="text-white fill-white size-8 ml-1" />
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full">
          <div className="h-full bg-primary animate-pulse w-[40%] shadow-[0_0_10px_#fff]" />
        </div>
      </div>
    </Card>
  );
};

export default DesignYourOwn;
