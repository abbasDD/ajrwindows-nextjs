import {
  LayoutDashboard,
  Home,
  ImageIcon,
  MessageSquareQuote,
  FileText,
  Settings,
  ShoppingCart,
  FolderTree,
  Package,
  Users,
  MessageCircle,
  Tag,
  CreditCard,
} from "lucide-react";

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  isCollapsible?: boolean;
  children?: MenuItem[];
}

export const ADMIN_SIDEBAR_MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Frontend",
    icon: Home,
    isCollapsible: true,
    children: [
      {
        label: "Home Sliders",
        icon: ImageIcon,
        path: "/admin/dashboard/home-slider",
      },
      {
        label: "Testimonials",
        icon: MessageSquareQuote,
        path: "/admin/dashboard/testimonials",
      },
      {
        label: "About Content",
        icon: FileText,
        path: "/admin/dashboard/about",
      },
      { label: "Settings", icon: Settings, path: "/admin/dashboard/settings" },
    ],
  },
  {
    label: "Manage Orders",
    icon: ShoppingCart,
    path: "/admin/dashboard/manage-orders",
  },
  {
    label: "Manage Categories",
    icon: FolderTree,
    path: "/admin/dashboard/manage-categories",
  },
  {
    label: "Product Types",
    icon: Package,
    path: "/admin/dashboard/product-type",
  },
  {
    label: "Manage Products",
    icon: Package,
    path: "/admin/dashboard/manage-product",
  },
  {
    label: "Manage Users",
    icon: Users,
    path: "/admin/dashboard/manage-users",
  },
  {
    label: "Manage Queries",
    icon: MessageCircle,
    path: "/admin/dashboard/manage-queries",
  },
  {
    label: "Manage Promo Codes",
    icon: Tag,
    path: "/admin/dashboard/manage-promo-codes",
  },
  // {
  //   label: "Payment Settings",
  //   icon: CreditCard,
  //   path: "/admin/dashboard/payment-settings",
  // },
];
// storage bucket enums
export enum Buckets {
  HOME_IMAGES = "home-images",
  PRODUCTS = "products",
}
// currency enums for payments
export enum Currency {
  USD = "USD",
  CAD = "CAD",
}
