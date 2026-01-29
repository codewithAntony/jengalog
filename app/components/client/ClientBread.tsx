import { ChevronDown } from "lucide-react";
import React from "react";

const ClientBread = () => {
  return (
    <section className="bg-[#05130D]">
      <div className="mx-auto max-w-7xl h-screen px-4 sm:px-3 lg:px-8 py-12 md:py-28 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-10">
            Build as one, <br /> get more{" "}
            <span className="text-emerald-500">done</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
            Deliver a best-in-class homebuyer experience. JengaLog brings
            builders, developers, and buyers together to streamline residential
            construction.
          </p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors text-lg inline-flex items-center space-x-2">
            <span>Book a demo</span>
            <ChevronDown className="w-5 h-5 rotate-90deg" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientBread;
