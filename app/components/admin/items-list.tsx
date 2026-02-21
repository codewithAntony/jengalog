import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import InvoiceItem from "./invoice-item";
import { useInvoice } from "@/context/invoice-context";

export default function ItemsList() {
  const { invoice, addItem } = useInvoice();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoice Items</CardTitle>
        <Button
          onClick={addItem}
          size="sm"
          className="bg-emerald-500 hover:bg-emerald-500 disabled:bg-emerald-800 text-[#05130d] "
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoice.items.map((item, index) => (
          <InvoiceItem
            key={item.id}
            item={item}
            index={index}
            canRemove={invoice.items.length > 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}
