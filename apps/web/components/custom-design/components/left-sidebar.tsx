"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  exportToPdf,
  generateDesignId,
  getCanvasImageUrl,
  getShapeInfo,
} from "@/lib/utils";
import {
  FileText,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SHAPE_PRICES } from "@/constant/canva";
import { useCartStore } from "@/store/use-cart-store";
import { useUserStore } from "@/store/use-user-store";
import { toast } from "sonner";
import { useSelf } from "@/liveblocks.config";

const LeftSidebar = ({
  allShapes,
  toggleLock,
}: {
  allShapes: Array<any>;
  toggleLock: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useUserStore();
  const addItem = useCartStore((state) => state.addItem);
  const self = useSelf();
  const canWrite = self?.canWrite ?? true;

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

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please login to your account to add items to the cart.",
        icon: <Lock className="h-4 w-4" />,
      });
      return;
    }
    const designId = await generateDesignId(allShapes);
    const canvaImage = getCanvasImageUrl(designId);

    const totalPrice = allShapes?.reduce(
      (total: number, [_, shapeData]: any) => {
        const type = shapeData?.customType || shapeData?.type;
        const price = SHAPE_PRICES[type] || 0;
        return total + price;
      },
      0,
    );

    addItem({
      id: designId,
      name: `Custom Design #${designId?.split("-")[0]}`,
      price: totalPrice,
      discounted_price: 0,
      image: canvaImage ?? "",
      quantity: 1,
    });

    toast.success(`Custom product  added to cart`, {
      position: "bottom-left",
    });
  };
  const memoizedShapes = useMemo(
    () => (
      <aside
        className={`relative h-full  border-r border-secondary/20 transition-all duration-300 ease-in-out select-none flex flex-col
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
          <ScrollArea className="flex-1 overflow-y-auto  pb-20 flex flex-col justify-between items-center">
            <div className="flex flex-col flex-1">
              {allShapes?.map((shape) => {
                const shapeId = shape[0];
                const shapeData = shape[1];
                const isLocked = shapeData?.lockMovementX;

                const info = getShapeInfo(shapeData?.type);
                const Icon = info?.Icon;
                return (
                  <div
                    key={shape[1]?.objectId}
                    className="group my-1 flex items-center justify-between gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      <h3 className="text-sm  capitalize truncate">
                        {info.name}
                      </h3>
                    </div>
                    <button
                      className="size-5 hover:opacity-70 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(shapeId);
                      }}
                    >
                      {isLocked ? (
                        <Lock size={15} />
                      ) : (
                        <Unlock size={15} className="text-secondary" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-3 py-3 px-5">
              <h3 className="text-[10px] uppercase font-medium">Action</h3>
              <Button variant="outline" onClick={exportToPdf}>
                Export to PDF
              </Button>
              <Button
                disabled={!canWrite}
                variant="outline"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col items-center pt-10 gap-4">
            {allShapes?.slice(0, 6).map((shape) => {
              const info = getShapeInfo(shape[1]?.type);
              const Icon = info?.Icon;
              return Icon ? (
                <Icon key={shape[1]?.objectId} className="w-4 h-4" />
              ) : null;
            })}
            <div className="flex flex-col gap-3 py-3 px-5">
              <Button variant="outline" size={"icon"} onClick={exportToPdf}>
                <FileText />
              </Button>

              <Button
                disabled={!canWrite}
                variant="outline"
                size="icon"
                onClick={handleAddToCart}
              >
                <ShoppingBag />
              </Button>
            </div>
          </div>
        )}
      </aside>
    ),
    [allShapes, isOpen],
  );

  return memoizedShapes;
};

export default LeftSidebar;
