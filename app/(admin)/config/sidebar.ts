import {
  Bell,
  DollarSign,
  House,
  Info,
  Mail,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const SidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard/dashboard",
    icon: House,
  },
  {
    name: "Add Employees",
    href: "/dashboard/add-employees",
    icon: Mail,
  },
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: Bell,
  },
  {
    name: "Updates",
    href: "/dashboard/post-update",
    icon: ShoppingBag,
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: ShoppingBag,
  },
  // {
  //   name: "Clients",
  //   href: "/admin-dashboard/user",
  //   icon: Users,
  // },
  // {
  //   name: "Sales",
  //   href: "/admin-dashboard/overview",
  //   icon: DollarSign,
  // },
  // {
  //   name: "Orders",
  //   href: "/admin-dashboard/orders",
  //   icon: ShoppingCart,
  // },

  // {
  //   name: "Settings",
  //   href: "/admin-dashboard/settings",
  //   icon: Settings,
  // },
  // {
  //   name: "Help",
  //   href: "/admin-dashboard/help",
  //   icon: Info,
  // },
];
