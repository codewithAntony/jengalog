import { supabase } from "@/lib/supabase";
import React, { useState } from "react";

const StatusDropdown = ({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: string;
}) => {
  const [status, setStatus] = useState(currentStatus);

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status: newStatus })
      .eq("id", invoiceId);

    if (!error) setStatus(newStatus);
  };

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };
  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      className={`text-xs font-medium rounded-full px-3 py-1 border-none cursor-pointer ${getStatusStyles(status)}`}
    >
      <option value="Pending">Pending</option>
      <option value="Paid">Paid</option>
      <option value="Canceled">Canceled</option>
    </select>
  );
};

export default StatusDropdown;
