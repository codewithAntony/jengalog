"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-[#FEFEFE] shadow-md">
      <div className="mx-auto max-w-7xl flex justify-between items-center px-4 py-3">
        <a href="#home" className="cursor-pointer">
          <span className="font-bold text-[#2E2E2E] text-lg ">Jenga</span>
          <span className="text-[#0018F9] font-bold text-lg">Log</span>
        </a>

        <div className="hidden md:flex justify-between gap-3">
          <Link href="/login">
            <button className="uppercase font-semibold text-[#2E2E2E] px-6 py-2 border-black border-2 rounded-lg hover:bg-[#EBEBEB]">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="uppercase font-semibold text-[#2E2E2E] px-6 py-2 border-black border-2 rounded-lg hover:bg-[#EBEBEB]">
              Sign up for free
            </button>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 pb-4">
          <Link
            href="/login"
            className="block py-2 uppercase"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="block py-2 uppercase"
            onClick={() => setOpen(false)}
          >
            Sign up for free
          </Link>
        </div>
      )}
    </div>
  );
};
