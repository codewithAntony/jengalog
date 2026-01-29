import { ChevronRight } from "lucide-react";
import React from "react";

const ClientBread = () => {
  return (
    <section className="bg-[#05130D] border-b border-white/10">
      <div className="mx-auto max-w-7xl h-screen grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] border-white/10">
        {/* Left Vertical Line Column */}
        <div className="hidden md:block border-r border-white/10" />

        {/* Center Content Section */}
        <div className="flex flex-col items-center justify-center text-center px-4 sm:px-3 lg:px-8 py-12 md:py-28 lg:py-32 relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-10">
              Build as one, <br /> get more{" "}
              <span className="text-emerald-500">done.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Professional jobsite photo documentation meets complete project
              management—capture unlimited photos, create stunning reports,
              manage your entire business
            </p>
            <button className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-8 py-3 rounded-full hover:bg-emerald-500 hover:text-white transition-all text-lg inline-flex items-center space-x-2">
              <span>Book a demo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1px bg-white/10" />
        </div>

        <div className="hidden md:block border-l border-white/10" />
      </div>
    </section>
  );
};

export default ClientBread;
