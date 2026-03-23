"use client";

import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useState } from "react";

export default function page() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`*, invoice_items (*)`)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error:", error);
      } else {
        setInvoice(data);
      }
      setLoading(false);
    };

    if (id) fetchInvoiceData();
  }, [id]);

  if (loading) return <div className="p-8 text-white">Loading Invoice...</div>;
  if (!invoice) return <div className="p-8 text-white">Invoice not found.</div>;
  return (
    <div className="p-8 bg-[#121212] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-emerald-500 text-black"
          >
            <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
          </Button>
        </div>

        <Card className="bg-white text-black">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">INVOICE</CardTitle>
                <p className="text-gray-500">#{invoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  Status:
                  <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">
                    {invoice.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(invoice.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-gray-500 uppercase text-xs font-bold mb-2">
                  From
                </h3>
                <p className="font-bold">
                  {invoice.from_name || invoice.fromName}
                </p>
                <p className="text-sm">{invoice.from_email}</p>
              </div>
              <div>
                <h3 className="text-gray-500 uppercase text-xs font-bold mb-2">
                  To
                </h3>
                <p className="font-bold">{invoice.to_name}</p>
                <p className="text-sm">{invoice.to_email}</p>
              </div>
            </div>

            <div className="border-t pt-6 flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Kes {invoice.sub_total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span>
                    Kes{" "}
                    {((invoice.sub_total * invoice.tax_rate) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t pt-3">
                  <span>Total</span>
                  <span>Kes {invoice.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
