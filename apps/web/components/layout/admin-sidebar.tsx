"use client";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import { ADMIN_SIDEBAR_MENU_ITEMS } from "@/constant/constant";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Image
          src="/logo.png"
          alt="logo"
          width={80}
          height={100}
          className="mx-auto py-4"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {ADMIN_SIDEBAR_MENU_ITEMS.map((item, index) => {
                if (item.isCollapsible && item.children) {
                  return (
                    <SidebarMenuItem key={index}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            <ChevronDown className="ml-auto" />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                          {item.children.map((child, childIndex) => {
                            const Icon = child.icon;
                            return (
                              <DropdownMenuItem key={childIndex}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(child.path)}
                                >
                                  <Link
                                    href={child.path || "#"}
                                    className="flex items-center gap-2"
                                  >
                                    <Icon className="w-4 h-4" />
                                    <span>{child.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                }

                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link
                        href={item.path || "#"}
                        className="flex items-center gap-2"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
