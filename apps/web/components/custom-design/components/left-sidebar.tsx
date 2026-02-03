"use client";

import React, { useMemo, useState, useEffect } from "react";
import { getShapeInfo } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const LeftSidebar = ({ allShapes }: { allShapes: Array<any> }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    checkScreen();
  }, []);
  console.log(allShapes);
  const memoizedShapes = useMemo(
    () => (
      <aside
        className={`relative h-full border-r border-secondary/20 transition-all duration-300 ease-in-out select-none flex flex-col
        ${isOpen ? "min-w-[227px]" : "w-12"}`}
      >
        <div
          className={`flex items-center p-3 ${isOpen ? "justify-between" : "justify-center"}`}
        >
          {isOpen && (
            <h3 className="text-xs  uppsercase text-primary-grey-300">
              Layers
            </h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 text-primary-grey-300 hover:bg-accent"
          >
            {isOpen ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </Button>
        </div>

        <Separator className="bg-primary-grey-200" />

        {isOpen ? (
          <ScrollArea className="flex-1 overflow-y-auto pb-20">
            <div className="flex flex-col">
              {allShapes?.map((shape) => {
                const info = getShapeInfo(shape[1]?.type);
                const Icon = info?.Icon;

                return (
                  <div
                    key={shape[1]?.objectId}
                    className="group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black transition-colors"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <h3 className="text-sm  capitalize truncate">
                      {info.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col items-center pt-10 gap-4 opacity-40 pointer-events-none">
            {allShapes?.slice(0, 6).map((shape) => {
              const info = getShapeInfo(shape[1]?.type);
              const Icon = info?.Icon;
              return Icon ? (
                <Icon key={shape[1]?.objectId} className="w-4 h-4" />
              ) : null;
            })}
          </div>
        )}
      </aside>
    ),
    [allShapes, isOpen],
  );

  return memoizedShapes;
};

export default LeftSidebar;
