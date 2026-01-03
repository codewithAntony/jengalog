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
    href: "/admin-dashboard/overview",
    icon: House,
  },
  {
    name: "Products",
    href: "/admin-dashboard/products",
    icon: ShoppingBag,
  },
  {
    name: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    name: "Sales",
    href: "/dashboard/sales",
    icon: DollarSign,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: Mail,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: Info,
  },
];
