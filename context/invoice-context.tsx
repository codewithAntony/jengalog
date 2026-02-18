"use client";

import { initialInvoiceData } from "@/lib/constants";
import { InvoiceData } from "@/types/invoice";
import { createContext, ReactNode, useContext, useState } from "react";

interface InvoiceContextType {
  invoice: InvoiceData;
  updateInvoice: (updates: Partial<InvoiceData>) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoice, setInvoice] = useState<InvoiceData>(initialInvoiceData);

  const updateInvoice = (updates: Partial<InvoiceData>) => {
    const newInvoice = { ...invoice, ...updates };
    setInvoice(newInvoice);
  };

  return (
    <InvoiceContext.Provider value={{ invoice, updateInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
}
