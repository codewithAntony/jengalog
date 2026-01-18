"use client";

import React, { useState } from "react";
import { uploadSiteUpdate } from "@/lib/actions/site-actions";
import { Camera, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  location: string;
  profiles: { first_name: string; last_name: string } | any;
}

export default function AdminForm({ projects }: { projects: Project[] }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold text-white">Post Site Progress</h1>
      </div>

      <form
        action={async (formData) => {
          setLoading(true);
          await uploadSiteUpdate(formData);
          setLoading(false);
          alert("Update posted!");
        }}
        className="space-y-5"
      >
        {/* Project Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Select Project / Client
          </label>
          <select
            name="projectId"
            required
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select a Project --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} — {project.profiles?.first_name}
                {project.profiles?.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Other inputs (Title, Description, File) remain the same as before */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Update Title
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full p-3 border rounded-lg"
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
            className="w-full text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-slate-400"
        >
          {loading ? "Processing..." : "Post to Client Dashboard"}
        </button>
      </form>
    </div>
  );
}
