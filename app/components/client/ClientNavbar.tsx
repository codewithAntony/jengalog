"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import manager from "../../../public/images/site-manager.png";
import { Menu, X } from "lucide-react";

const ClientNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <nav className="w-full sticky top-0 left-0 z-50 bg-[#05130D] shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="cursor-pointer flex gap-2 items-center">
            <Image
              src={manager}
              alt="Site-Logo"
              width={25}
              height={18}
              className="rounded-md bg-white shadow-md cursor-pointer"
            />
            <div className="text-lg uppercase font-bold tracking-tight">
              <span className="text-gray-100">Jenga</span>
              <span className="text-emerald-500">Log</span>
            </div>
          </Link>

          <div className="hidden md:flex justify-between gap-8 items-center">
            <Link href="#features">
              <span className="text-gray-100 uppercase text-sm hover:text-emerald-500 transition-colors">
                Features
              </span>
            </Link>
            <a href="#pricing">
              <span className="text-gray-100 uppercase text-sm hover:text-emerald-500 transition-colors">
                Pricing
              </span>
            </a>
            <a href="#contact">
              <span className="text-gray-100 uppercase text-sm hover:text-emerald-500 transition-colors">
                Contact
              </span>
            </a>
          </div>
          <Link href="/auth">
            <button className="uppercase font-semibold bg-emerald-500 hover:bg-emerald-500 text-black px-6 py-2 border-black border-2 rounded-lg transition-all">
              Start 30 day free trial
            </button>
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 pb-4">
          <Link
            href="#features"
            className="text-gray-100 uppercase py-2 border-b border-gray-800"
            onClick={toggleMenu}
          >
            Features
          </Link>
          <Link
            href="#features"
            className="text-gray-100 uppercase py-2 border-b border-gray-800"
            onClick={toggleMenu}
          >
            Pricing
          </Link>
          <Link
            href="#features"
            className="text-gray-100 uppercase py-2 border-b border-gray-800"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <Link href="/auth" onClick={toggleMenu}>
            <button className="w-full uppercase font-semibold bg-emerald-500 text-black px-6 py-3 border-black border-2 ronded-lg mt-2">
              Start 30 day free trial
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
