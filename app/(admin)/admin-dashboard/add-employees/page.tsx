"use client";

import { createEmployee } from "@/lib/actions/auth-actions";
import { Loader2, Lock, Mail, Phone, Shield, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

export default function page() {
  const router = useRouter();
  const [isPending, startTransiton] = useTransition();

  const handleAction = async (formData: FormData) => {
    startTransiton(async () => {
      try {
        await createEmployee(formData);
        toast.success("Employee added and synced!");
        router.push("/admin-dashboard/employees");
      } catch (error: any) {
        toast.error(error.message || "Failed to add employee");
      }
    });
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-500/10 p-3 rounded-2xl">
          <UserPlus className="text-emerald-500" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Employee</h1>
        </div>
      </div>

      <form
        action={handleAction}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1e1e1e] p-8 rounded-[32px] border border-white/5 shadow-2xl"
      >
        <div className="flex space-y-2 gap-3">
          <label className="text-sm font-medium text-slate-300 ml-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            placeholder="John"
            className="input-style bg-gray-100 outline-none"
          />
        </div>
        <div className="flex space-y-2 gap-3">
          <label className="text-sm font-medium text-slate-300 ml-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            placeholder="Doe"
            className="input-style bg-gray-100 outline-none"
          />
        </div>

        <div className="flex space-y-2 gap-3">
          <label className="text-sm font-medium text-slate-300 ml-1">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            required
            placeholder="john@company.com"
            className="input-style pl-12 bg-gray-100 outline-none"
          />
        </div>

        <div className="flex space-y-2 gap-3">
          <label className="text-sm font-medium text-slate-300 ml-1">
            Phone Number
          </label>
          <input
            type="tell"
            name="phone"
            required
            placeholder="+254..."
            className="input-style bg-gray-100 outline-none"
          />
        </div>

        <div className="flex space-y-2 gap-3">
          <label className="text-sm font-medium text-slate-300 ml-1">
            Company Role
          </label>

          <select
            name="roleId"
            required
            className="input-style pl-12 text-emerald-500 appearance-none"
          >
            <option value="3">Admin</option>
          </select>
        </div>

        <div className="flex space-y-2 gap-3">
          <label className="text-sm font-medium text-slate-300 ml-1">
            Password
          </label>

          <input
            name="password"
            type="password"
            required
            placeholder="......."
            className="input-style pl-12 bg-gray-100 outline-none"
          />
        </div>

        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-500 hover:bg-emerald-500 disabled:bg-emerald-800 text-[#05130d] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Confirm & Add Employee"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
