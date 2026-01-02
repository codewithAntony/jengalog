"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  name: string;
  value: string;
  icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ name, icon: Icon, value }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 25px -12px rgba(0, 0, 0, 0.5)" }}
      className="bg-[#1e1e1e] backdrop-blur-md overflow-hidden shadow-lg rounded-xl border-[#1f1f1f]"
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-medium text-gray-300">
          <Icon size={20} className="mr-2" />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
