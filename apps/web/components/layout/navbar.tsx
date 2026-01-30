"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import AuthModal from "../auth/auth.modal";
import LayoutXSmall from "./layout-x-small";
import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUserStore } from "@/store/use-user-store";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CartSheet } from "../cart/cart-sheet";

const supabase = createClient();

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Catalog", href: "/catalog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
const UserNav = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <Avatar className="size-8 md:size-10 xl:size-12 border-2 border-secondary transition-transform hover:scale-105">
            <AvatarFallback className="cursor-pointer bg-secondary text-black font-bold">
              {getInitials(user?.email ?? "")}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuLabel className="font-normal cursor-pointer hover:bg-secondary/10 rounded-sm">
          <Link href={"/user-orders"} className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Orders</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              Users Orders
            </p>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 cursor-pointer focus:text-red-500"
          onClick={handleLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const Navbar = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <header className="absolute z-50 w-full top-0 py-6">
      <LayoutXSmall className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={50} height={50} priority />
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex gap-x-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white text-base hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {user && <CartSheet />}
          {user ? <UserNav /> : <AuthModal />}
        </div>

        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="size-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="px-6 flex flex-col">
              <SheetHeader className="text-left pb-6 border-b border-white/10">
                <SheetTitle className="text-xl font-bold tracking-tighter">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col flex-1 justify-between py-8">
                <nav className="flex flex-col gap-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="space-y-6 pt-8 border-t border-white/10">
                  {user ? (
                    <div className="space-y-6">
                      <CartSheet />
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                        <Avatar className="size-12 border-2 border-secondary">
                          <AvatarFallback className="bg-secondary text-black">
                            {getInitials(user?.email ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <p className="text-sm font-bold truncate">
                            {user?.email}
                          </p>
                          <p className="text-[10px] uppercase text-white/40 tracking-widest">
                            Logged In
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        className="w-full flex justify-center gap-2 h-12 text-lg"
                        onClick={handleLogout}
                      >
                        <LogOut size={20} />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className="text-sm text-white/40 mb-4">
                        Account access
                      </p>

                      <AuthModal />
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </LayoutXSmall>
    </header>
  );
};

export default Navbar;
