import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import InvoiceItem from "./invoice-item";

export const items = [
  {
    id: "1",
    description: "Website Design",
    quantity: 1,
    rate: 500,
    amount: 500,
  },
  {
    id: "2",
    description: "Hosting (12 months)",
    quantity: 1,
    rate: 120,
    amount: 120,
  },
];

export default function ItemsList() {
  const addItem = () => {};
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoice Items</CardTitle>
        <Button onClick={addItem} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <InvoiceItem
            key={item.id}
            item={item}
            index={index}
            canRemove={items.length > 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}
