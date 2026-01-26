"use client";

import { ShoppingBag, Plus, Minus, X } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

export const CartSheet = () => {
  const router = useRouter();
  const { items, removeItem, clearCart, updateQuantity, getTotalPrice } =
    useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 group transition-transform active:scale-95">
          <ShoppingBag className="size-6 md:size-7 text-white group-hover:text-secondary transition-colors" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 size-5 bg-secondary text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-xl font-bold tracking-tighter flex items-center gap-2">
            Your Cart <span className="text-white/20">({itemCount})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="text-base font-light tracking-widest">
                CART IS EMPTY
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full px-6">
              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={() => clearCart()}
              >
                Remove All
              </Button>
              <div className="space-y-8 py-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative size-24 rounded-2xl overflow-hidden border border-white/5 bg-white/5 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-secondary font-semibold text-sm">
                            ${item.discounted_price || item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6  backdrop-blur-xl border-t border-white/5 flex-col sm:flex-col space-y-4">
            <div className="flex justify-between items-center w-full">
              <span className="text-white/60 font-medium uppercase tracking-widest text-xs">
                Subtotal
              </span>
              <span className="text-2xl font-bold text-white">
                ${getTotalPrice()}
              </span>
            </div>
            <Button
              variant={"secondary"}
              onClick={() => router.push("/checkout")}
              className="w-full h-14 rounded-xl  font-semibold text-lg hover:scale-[1.02] transition-transform"
            >
              Checkout Now
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
