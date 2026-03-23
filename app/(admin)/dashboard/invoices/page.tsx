"use client";

import StatusDropdown from "@/app/components/admin/StatusDropdown";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInvoices(data);
      }
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const search = searchTerm.toLowerCase();
    return (
      inv.to_name?.toLowerCase().includes(search) ||
      inv.invoice_number?.toLowerCase().includes(search)
    );
  });

  if (loading) return <div className="p-8 text-white">Loading invoices...</div>;

  return (
    <div className="p-8 bg-[#1E1E1E] min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Invoices</h2>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="bg-white hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {inv.invoice_number}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{inv.to_name}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {inv.project || "General"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Kes {Number(inv.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusDropdown
                        invoiceId={inv.id}
                        currentStatus={inv.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/invoice-details/${inv.id}`}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No matching invoices found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
