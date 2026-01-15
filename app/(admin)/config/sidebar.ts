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
    href: "/admin-dashboard/dashboard",
    icon: House,
  },
  {
    name: "Products",
    href: "/admin-dashboard/products",
    icon: ShoppingBag,
  },
  {
    name: "Clients",
    href: "/admin-dashboard/user",
    icon: Users,
  },
  {
    name: "Sales",
    href: "/admin-dashboard/overview",
    icon: DollarSign,
  },
  {
    name: "Orders",
    href: "/admin-dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Messages",
    href: "/admin-dashboard/add-employees",
    icon: Mail,
  },
  {
    name: "Notifications",
    href: "/admin-dashboard/employees",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/admin-dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/admin-dashboard/help",
    icon: Info,
  },
];
