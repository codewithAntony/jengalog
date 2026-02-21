"use client";

import React, { useState } from "react";
import InvoicePreview from "@/app/components/admin/invoice-preview";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import InvoiceForm from "@/app/components/admin/invoice-form";

export default function page() {
  const [showPreview, setShowPreview] = useState(false);

  if (showPreview) {
    return <InvoicePreview onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl text-white font-bold">
              JengaLog Invoice Generator
            </h1>
          </div>
          <Button
            className="bg-emerald-500 hover:bg-emerald-500 disabled:bg-emerald-800 text-[#05130d] "
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        <InvoiceForm />
      </div>
    </div>
  );
}
