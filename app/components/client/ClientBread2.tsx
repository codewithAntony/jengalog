"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Users,
  Camera,
  Zap,
  FileText,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const features = [
  {
    title: "PROJECT CRM & PIPELINE",
    desc: "Pipeline management with custom stages, drag-and-drop, and complete project tracking",
    icon: Users,
  },
  {
    title: "JOBSITE DOCUMENTATION",
    desc: "Capture unlimited photos and videos with GPS tagging, timestamps, and cloud storage",
    icon: Camera,
  },
  {
    title: "REAL-TIME COLLABORATION",
    desc: "Instant notifications, activity feeds, and live updates across your team in real-time",
    icon: Zap,
  },
  {
    title: "PROFESSIONAL REPORTS",
    desc: "Create custom PDF reports with flexible layouts, cover pages, and secure sharing links",
    icon: FileText,
  },
  {
    title: "ENTERPRISE SECURITY",
    desc: "Multi-tenancy with role-based access control and complete audit trails for compliance",
    icon: ShieldCheck,
  },
  {
    title: "LOCATION INTELLIGENCE",
    desc: "Automatic geocoding, distance calculations, and map visualization for all your projects",
    icon: MapPin,
  },
];

const FeaturesSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), {
    stiffness: 100,
    damping: 30,
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#05130D] py-24 overflow-hidden"
    >
      {/* Outer Layout Lines (Left and Right only) */}
      <div className="absolute inset-0 mx-auto max-w-7xl grid grid-cols-[1fr_10fr_1fr] pointer-events-none">
        {/* Left Border + Scroll Pip */}
        <div className="border-r border-white/10 relative">
          <motion.div
            style={{ y: smoothY }}
            className="absolute top-1/2 right-[-1px] w-[2px] h-24 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>

        {/* Center Space for Content */}
        <div className="bg-transparent" />

        {/* Right Border + Scroll Pip */}
        <div className="border-l border-white/10 relative">
          <motion.div
            style={{ y: smoothY }}
            className="absolute top-1/3 left-[-1px] w-[2px] h-24 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Core Features
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Streamline your workflow with integrated project management,
            documentation, and team collaboration tools.
          </p>
        </div>

        {/* The Feature Grid (Removed inner layout lines) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all duration-300"
            >
              <div className="mb-4 text-emerald-500">
                <f.icon className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-gray-100 font-bold text-sm tracking-widest mb-3 uppercase">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
