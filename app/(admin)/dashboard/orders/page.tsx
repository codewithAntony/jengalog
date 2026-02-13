"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ban, CheckCircle, Clock, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import StatCard from "@/app/components/admin/StatCard";
import OrdersTable from "@/app/components/admin/OrdersTable";
import ordersData from "@/public/data/data.json";

const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  CheckCircle,
  Clock,
  Ban,
};

type OrderStat = {
  name: string;
  value: number;
  icon: keyof typeof iconMap;
};

type OrdersPageData = {
  orderStats: OrderStat[];
};

const typedOrdersData = ordersData as OrdersPageData;

const OrderPage = () => {
  return (
    <div className="flex-1 relative overflow-auto z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {typedOrdersData.orderStats.map(({ name, value, icon }) => {
            const IconComponent = iconMap[icon];
            return (
              <StatCard
                key={name}
                name={name}
                icon={IconComponent}
                value={value}
              />
            );
          })}
        </motion.div>

        <OrdersTable />
      </main>
    </div>
  );
};

export default OrderPage;
