"use client";

import React, { useEffect, useRef, useState } from "react";
import { RightSidebarProps } from "@/types/canva-types";
import { modifyShape } from "@/lib/shapes";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import Text from "./settings/text";
import Color from "./settings/color";
import Export from "./settings/export";
import Dimensions from "./settings/dimensions";
import Share from "./settings/share";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;
    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  return (
    <aside
      className={`relative h-full border-l bg-card transition-all duration-300 ease-in-out select-none flex flex-col
        ${isOpen ? "w-[300px]" : "w-12"}`}
    >
      <div
        className={`flex items-center p-3 ${isOpen ? "justify-between" : "justify-center"}`}
      >
        {isOpen && (
          <div className="flex flex-col">
            <h3 className="text-xs uppercase font-semibold text-primary-grey-300">
              Design
            </h3>
            <p className="text-[10px] text-muted-foreground">Properties</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 text-primary-grey-300 hover:bg-accent"
        >
          {isOpen ? (
            <PanelRightClose size={18} />
          ) : (
            <PanelRightOpen size={18} />
          )}
        </Button>
      </div>

      <Separator className="bg-primary-grey-200" />

      {isOpen && (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-y-2 p-4 pb-20">
            <Dimensions
              isEditingRef={isEditingRef}
              width={elementAttributes.width}
              height={elementAttributes.height}
              handleInputChange={handleInputChange}
            />

            <Separator className="my-2 opacity-50" />

            <Text
              fontFamily={elementAttributes.fontFamily}
              fontSize={elementAttributes.fontSize}
              fontWeight={elementAttributes.fontWeight}
              handleInputChange={handleInputChange}
            />

            <Separator className="my-2 opacity-50" />

            <Color
              inputRef={colorInputRef}
              attribute={elementAttributes.fill}
              placeholder="color"
              attributeType="fill"
              handleInputChange={handleInputChange}
            />

            <Color
              inputRef={strokeInputRef}
              attribute={elementAttributes.stroke}
              placeholder="stroke"
              attributeType="stroke"
              handleInputChange={handleInputChange}
            />

            <div className="flex flex-col mt-8">
              <Export />
              <Share />
            </div>
          </div>
        </ScrollArea>
      )}
    </aside>
  );
};

export default RightSidebar;
