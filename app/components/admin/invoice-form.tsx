import React from "react";
import BasicDetails from "./basic-details";
import ContactDetails from "./contact-details";
import TaxAndTotals from "./tax-and-totals";
import ItemsList from "./items-list";

export default function InvoiceForm() {
  return (
    <div className="space-y-6">
      <BasicDetails />
      <ContactDetails />
      <ItemsList />
      <TaxAndTotals />
    </div>
  );
}
