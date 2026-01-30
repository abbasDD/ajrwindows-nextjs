"use client";

import { ShapesMenuProps } from "@/types/canva-types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}: ShapesMenuProps) => {
  const isDropdownElem = item.value.some(
    (elem) => elem?.value === activeElement.value,
  );
  const Icon = isDropdownElem ? activeElement.Icon : item?.Icon;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <Button
            className="relative h-5 w-5 object-contain"
            onClick={() => handleActiveElement(item)}
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

            return (
              <Button
                key={elem?.name}
                onClick={() => {
                  handleActiveElement(elem);
                }}
                className="flex h-fit justify-between bg-transparent gap-10 rounded-none px-5 py-3 focus:border-none w-full"
              >
                <div className="group flex items-center gap-2">
                  {Icon && (
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-secondary" : ""}`}
                    />
                  )}
                  <p
                    className={`text-sm ${
                      isActive ? "text-secondary" : "text-white"
                    }`}
                  >
                    {elem?.name}
                  </p>
                </div>
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
