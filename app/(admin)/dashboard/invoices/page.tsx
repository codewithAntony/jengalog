"use client";

import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";

// const invoices: Invoice[] = [
//   {
//     id: "INV-001",
//     client: "John",
//     project: "House A",
//     amount: "250K",
//     status: "Pending",
//   },
// ];

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-white">Loading invoices...</div>;
  return (
    <div className="p-8 bg-[#1E1E1E] min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Invoices</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">client</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-blue-600">
                    {inv.invoice_number}
                  </td>
                  <td className="px-6 py-4">{inv.to_name}</td>
                  <td className="px-6 py-4">Project Alpha</td>
                  <td className="px-6 py-4 font-semibold">
                    Kes {inv.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1
                                        ${
                                          inv.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : inv.status === "Paid"
                                              ? "bg-green-100 text-green-700"
                                              : "bg-red-100 text-red-700"
                                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${inv.status === "Pending" ? "bg-yellow-500" : "bg-green-500"}`}
                      />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
