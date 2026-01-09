"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Pencil, Trash2, Upload, X } from "lucide-react";

// --- Types ---
type Step = "DASHBOARD" | "PROJECT_NAME" | "PLAN_SETUP" | "FOLDERS" | "DETAILS";

interface Project {
  id: string;
  name: string;
  clientName: string;
  notes: string;
  folders: string[];
  timestamp: string;
}

export default function SiteCamProjectManager() {
  const [currentStep, setCurrentStep] = useState<Step>("DASHBOARD");
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Example Project",
      clientName: "Default Client",
      notes: "Initial project",
      folders: ["General"],
      timestamp: "18 minutes ago",
    },
  ]);

  // Form State
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [folders, setFolders] = useState<string[]>(["auto-1"]);

  // --- Handlers ---
  const handleCreateProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: projectName,
      clientName,
      notes,
      folders,
      timestamp: "Just now",
    };
    setProjects([newProject, ...projects]);
    resetForm();
    setCurrentStep("DASHBOARD");
  };

  const resetForm = () => {
    setProjectName("");
    setClientName("");
    setNotes("");
    setFolders(["auto-1"]);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // --- Sub-Components ---

  const ProgressBar = ({ stepIndex }: { stepIndex: number }) => (
    <div className="flex items-center justify-between w-full max-w-3xl mb-12 relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />
      <div
        className={`absolute top-1/2 left-0 h-0.5 bg-emerald-400 transition-all duration-300 -z-10`}
        style={{ width: `${(stepIndex / 3) * 100}%` }}
      />
      {["Project Name", "Plan Setup", "Create Folders"].map((label, i) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className={`w-3 h-3 rounded-full ${
              i <= stepIndex ? "bg-emerald-400" : "bg-gray-300"
            }`}
          />
          <span
            className={`text-[12px] mt-2 font-medium ${
              i <= stepIndex ? "text-gray-100" : "text-gray-400"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 font-sans text-gray-800">
      <main className="py-6 px-4 lg:px-8 max-w-7xl mx-auto">
        {/* DASHBOARD VIEW (spro5.png) */}
        {currentStep === "DASHBOARD" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-100">Sort by</span>
                <select className="border-none text-gray-100 text-sm font-medium focus:ring-0">
                  <option>Date</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-200 text-gray-100 rounded-full text-sm w-64 focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    🔍
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep("PROJECT_NAME")}
                  className="bg-amber-400 hover:bg-amber-500 font-bold py-2 px-4 rounded flex items-center gap-2 text-sm"
                >
                  <Plus size={18} /> NEW PROJECT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group cursor-pointer">
                  <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden relative border border-gray-100 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1590001158193-79cd7c7d3f76?auto=format&fit=crop&q=80&w=400"
                      alt="Project"
                      className="w-full h-full object-cover grayscale opacity-80"
                    />

                    {/* Menu Overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded shadow-md flex flex-col p-1">
                        <button className="p-2 hover:bg-gray-100 rounded text-blue-600">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-gray-100">
                    {project.name}
                  </h3>
                  <p className="text-[11px] text-gray-100 mt-0.5">
                    {project.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREATE STEPS (spro, spro2, spro4) */}
        {currentStep !== "DASHBOARD" && (
          <div className="flex flex-col items-center pt-10">
            <h2 className="text-2xl text-gray-100 self-start mb-8">
              {currentStep === "PROJECT_NAME"
                ? "Create a new Project"
                : `New Project: ${projectName}`}
            </h2>

            <ProgressBar
              stepIndex={
                currentStep === "PROJECT_NAME"
                  ? 0
                  : currentStep === "PLAN_SETUP"
                  ? 1
                  : 2
              }
            />

            <div className="w-full max-w-xl flex flex-col items-center">
              {/* Step 1: Name (spro.png) */}
              {currentStep === "PROJECT_NAME" && (
                <div className="w-full space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-100">
                      Enter Project Name
                    </label>
                    <input
                      autoFocus
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Give your project a name (e.g. 8 Pilot St)"
                      className="w-full border-b-2 text-gray-100 py-2 focus:outline-none text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Plan (spro2.png) */}
              {currentStep === "PLAN_SETUP" && (
                <div className="w-full flex flex-col items-center py-10">
                  <p className="mb-6 text-gray-100 font-medium">
                    Select plans to upload
                  </p>
                  <div className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-16 h-16 text-gray-100">
                        <Upload size={64} />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 text-white border-4 border-white">
                        <Plus size={12} />
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-100">
                      Upload file (pdf, jpg, png)
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Details & Folders (spro4.png + customization) */}
              {currentStep === "FOLDERS" && (
                <div className="w-full space-y-8">
                  <p className="text-center text-gray-100">
                    Complete project details
                  </p>

                  {/* Client Name Spot */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-100 uppercase">
                      Client Name
                    </label>
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full border-b border-gray-200 text-gray-100 py-2 focus:outline-none"
                    />
                  </div>

                  {/* Folders List */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-100 uppercase">
                      Folders
                    </label>
                    {folders.map((folder, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded text-blue-600">
                          📁
                        </div>
                        <input
                          value={folder}
                          onChange={(e) => {
                            const newFolders = [...folders];
                            newFolders[idx] = e.target.value;
                            setFolders(newFolders);
                          }}
                          className="flex-1 border-b text-gray-500 py-1 focus:outline-none"
                        />
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Photo Notes Spot */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-100 uppercase">
                      Project Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add specific instructions for photo captures..."
                      className="w-full border border-gray-200 text-gray-100 rounded-lg p-3 text-sm focus:ring-1 focus:outline-none"
                    />
                    <button
                      onClick={() => setFolders([...folders, ""])}
                      className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      <Plus size={16} /> Add Folder
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-12 w-full max-w-xs">
                <button
                  onClick={() =>
                    currentStep === "PROJECT_NAME"
                      ? setCurrentStep("DASHBOARD")
                      : setCurrentStep("PROJECT_NAME")
                  }
                  className="flex-1 py-2 border border-gray-300 rounded-md font-bold text-gray-100 hover:bg-gray-500 transition-colors uppercase tracking-wider text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (currentStep === "PROJECT_NAME")
                      setCurrentStep("PLAN_SETUP");
                    else if (currentStep === "PLAN_SETUP")
                      setCurrentStep("FOLDERS");
                    else handleCreateProject();
                  }}
                  className="flex-1 py-2 bg-amber-400 rounded-md font-bold text-gray-800 hover:bg-amber-500 transition-colors uppercase tracking-wider text-sm"
                >
                  {currentStep === "FOLDERS" ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
