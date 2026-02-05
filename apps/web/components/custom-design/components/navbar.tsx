"use client";

import Image from "next/image";
import { memo } from "react";
import { navElements } from "@/constant/canva";
import { ActiveElement, NavbarProps } from "@/types/canva-types";
import { Button } from "@/components/ui/button";
import ShapesMenu from "./shapes-menu";
import ActiveUsers from "./users/active-users";
import { useSelf } from "@/liveblocks.config";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useUserStore } from "@/store/use-user-store";

const Navbar = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
}: NavbarProps) => {
  const self = useSelf();
  const canWrite = self?.canWrite ?? true;
  const { user } = useUserStore();
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none items-center  justify-between gap-4 border-b border-secondary/20 bg-primary px-5 text-white">
      <Image src="/logo.png" alt="FigPro Logo" width={35} height={20} />

      <ul className="flex flex-row">
        {navElements.map((item: ActiveElement | any) => {
          const Icon = item.Icon;
          const active = isActive(item.value);

          return (
            <li
              key={item.name}
              onClick={() => {
                if (Array.isArray(item.value)) return;
                handleActiveElement(item);
              }}
              className={`group px-2.5 py-5 flex justify-center items-center
              `}
            >
              {Array.isArray(item.value) ? (
                <ShapesMenu
                  item={item}
                  activeElement={activeElement}
                  imageInputRef={imageInputRef}
                  handleActiveElement={handleActiveElement}
                  handleImageUpload={handleImageUpload}
                />
              ) : (
                <Button disabled={!canWrite} size={"icon"}>
                  <Icon
                    className={`w-5 h-5 ${active ? "text-secondary" : ""}`}
                  />
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-1">
        {user && canWrite && <CartSheet customIcon />}
        <ActiveUsers />
      </div>
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement,
);
