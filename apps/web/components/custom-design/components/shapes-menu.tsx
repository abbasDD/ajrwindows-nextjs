"use client";

import { ShapesMenuProps } from "@/types/canva-types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSelf } from "@/liveblocks.config";
import { Badge } from "@/components/ui/badge";
import { SHAPE_PRICES } from "@/constant/canva";

const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}: ShapesMenuProps) => {
  const self = useSelf();
  const canWrite = self?.canWrite ?? true;
  const isDropdownElem = item.value.some(
    (elem) => elem?.value === activeElement.value,
  );
  const Icon = isDropdownElem ? activeElement.Icon : item?.Icon;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <Button
            size={"icon"}
            onClick={() => handleActiveElement(item)}
            disabled={!canWrite}
          >
            {Icon && (
              <Icon
                className={`w-5 h-5 ${isDropdownElem ? "text-secondary" : ""}`}
              />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {item.value.map((elem) => {
            const Icon = elem?.Icon;
            const isActive = activeElement.value === elem?.value;
            const price = SHAPE_PRICES[elem?.value as string];
            return (
              <Button
                key={elem?.name}
                onClick={() => {
                  handleActiveElement(elem);
                }}
                className="flex h-fit justify-between bg-transparent gap-10 rounded-none px-5 py-3 focus:border-none w-full"
              >
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                  )}
                  <p
                    className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                  >
                    {elem?.name}
                  </p>
                </div>
                <Badge variant={"outline"}>${price}</Badge>
              </Button>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ShapesMenu;
