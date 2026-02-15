"use client";

import React, { useState } from "react";
import { uploadSiteUpdate } from "@/lib/actions/site-actions";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminForm({ projects }: { projects: any[] }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const toastId = toast.loading("Uploading site progress...");

    const result = await uploadSiteUpdate(formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setIsPending(false);
      toast.error(result.message, { id: toastId });
    }
  }
  return (
    <div className="max-w-xl mx-auto p-8 bg-[#1E1E1E] shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500/10 p-3 rounded-2xl">
          <Camera className="text-emerald-500" size={24} />
        </div>

        <h1 className="text-2xl font-bold text-white">Post Site Progress</h1>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Select Project / Client
          </label>
          <select
            name="projectId"
            required
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 outline-none bg-white"
          >
            <option value="">-- Select a Project / Client --</option>
            {projects.map((project) => {
              const clientName = project.profiles
                ? `${project.profiles.first_name || "No Name"} ${project.profiles.last_name || ""}`.trim()
                : "Unassigned";

              const clientEmail = project.profiles?.email || "No Email";

              return (
                <option key={project.id} value={project.id}>
                  {project.name.toUpperCase()} - {clientName} ({clientEmail})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Update Title
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full p-3 bg-gray-100 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Site Photo
          </label>
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className="w-full text-sm text-white
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-emerald-500 file:text-[#05130d]
      hover:file:bg-emerald-400
      cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-emerald-500 hover:bg-emerald-500 disabled:bg-emerald-800 text-[#05130d] p-2 rounded-lg"
        >
          {isPending ? "Posting..." : "Post Update"}
        </button>
      </form>
    </div>
  );
}
