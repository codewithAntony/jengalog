"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { BellRing, Check, Pencil, Trash2, UserCog, X } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface EmployeeData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  role_id: string;
}

export default function page() {
  const supabase = getSupabaseBrowserClient();
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransiton] = useTransition();

  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EmployeeData>>({});

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load employees");
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    console.log("Deleting ID:", id);
    toast.warning("Are you sure?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const { error } = await supabase
            .from("employees")
            .delete()
            .eq("id", id);
          if (error) {
            console.error("Supabase Delete Error:", error);
            toast.error(error.message);
          } else {
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
            toast.success("Employee removed successfully");
          }
        },
      },
    });
  };

  const handleEditClick = (emp: EmployeeData) => {
    setEditRowId(emp.id);
    setEditData({ ...emp });
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    startTransiton(async () => {
      const { error } = await supabase
        .from("employees")
        .update({
          first_name: editData.first_name,
          last_name: editData.last_name,
          email: editData.email,
          phone: editData.phone,
        })
        .eq("id", id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Changes saved!");
        setEditRowId(null);
        fetchEmployees();
      }
    });
  };
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <div className="flex-1 px-4 sm:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-3 rounded-2xl">
              <UserCog className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">Manage Employees</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BellRing size={50} color="#10b981" />
          </div>
        ) : (
          <div className="bg-[#1e1e1e] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-emerald-400 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Contact</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-white/5">
                  {employees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Name Column */}
                      <td className="px-6 py-4">
                        {editRowId === emp.id ? (
                          <div className="flex gap-2">
                            <input
                              className="bg-[#0b1b18] border border-white/10 rounded-lg px-2 py-1 text-sm focus:border-emerald-500 outline-none"
                              value={editData.first_name}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  first_name: e.target.value,
                                })
                              }
                            />
                            <input
                              className="bg-[#0b1b18] border border-white/10 rounded-lg px-2 py-1 text-sm focus:border-emerald-500 outline-none"
                              value={editData.last_name}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  last_name: e.target.value,
                                })
                              }
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-white">
                            {emp.first_name} {emp.last_name}
                          </span>
                        )}
                      </td>

                      {/* Contact Column */}
                      <td className="px-6 py-4">
                        {editRowId === emp.id ? (
                          <div className="flex flex-col gap-1">
                            <input
                              className="bg-[#0b1b18] border border-white/10 rounded-lg px-2 py-1 text-sm outline-none"
                              value={editData.email}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  email: e.target.value,
                                })
                              }
                            />
                            <input
                              className="bg-[#0b1b18] border border-white/10 rounded-lg px-2 py-1 text-sm outline-none"
                              value={editData.phone}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                        ) : (
                          <div className="text-sm">
                            <div className="text-slate-200">{emp.email}</div>
                            <div className="text-slate-500 text-xs">
                              {emp.phone}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Date Column */}
                      {/* <td className="px-6 py-4 text-sm text-slate-500">
                        {emp.created_at
                          ? format(new Date(emp.created_at), "MMM dd, yyyy")
                          : "N/A"}
                      </td> */}

                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          {editRowId === emp.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(emp.id)}
                                className="text-emerald-500 hover:text-emerald-400"
                              >
                                <Check size={20} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-slate-500 hover:text-slate-400"
                              >
                                <X size={20} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(emp)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(emp.id)}
                                className="text-rose-500 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length === 0 && !loading && (
                <div className="p-10 text-center text-slate-500">
                  No employees found in the database.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
