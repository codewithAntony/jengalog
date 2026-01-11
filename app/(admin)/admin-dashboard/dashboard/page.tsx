"use client";

import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  ImageIcon,
  Search,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { convertBlobUrlToFile } from "@/lib/utils/convertBlobUrlToFile";
import { uploadImage } from "@/lib/supabase/storage/client";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";

type Step = "DASHBOARD" | "PROJECT_NAME" | "PLAN_SETUP" | "FOLDERS";

interface Project {
  id: string;
  name: string;
  client_name: string;
  notes: string;
  folders: string[];
  image_url?: string;
  created_at: string;
}

export default function ProjectPage() {
  const [currentStep, setCurrentStep] = useState<Step>("DASHBOARD");
  const [projects, setProjects] = useState<any[]>([]);

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("Default Client");
  const [notes, setNotes] = useState("");
  const [folders, setFolders] = useState<string[]>(["General"]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = getSupabaseBrowserClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching projects:", error);
      else if (data) setProjects(data);
    };
    fetchProjects();
  }, [supabase]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = async (id: string) => {
    toast("Are you sure?", {
      description: "This will permanently delete the project.",
      action: {
        label: "Delete",
        onClick: async () => {
          const deleteAction = async () => {
            const { error } = await supabase
              .from("projects")
              .delete()
              .eq("id", id);
            if (error) throw error;
          };

          toast.promise(deleteAction(), {
            loading: "Deleting project...",
            success: () => {
              setProjects((prev) => prev.filter((p) => p.id !== id));
              return "Project deleted successfully";
            },
            error: "Could not delete project",
          });
        },
      },
    });
  };

  const handleEditClick = (project: any) => {
    setEditingProjectId(project.id);
    setProjectName(project.name);
    setNotes(project.notes);
    setImageUrls(project.image_url ? [project.image_url] : []);
    setCurrentStep("PROJECT_NAME");
  };

  const removePreviewImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setProjectName("");
    setClientName("Default Client");
    setNotes("");
    setFolders(["General"]);
    setImageUrls([]);
    setCurrentStep("DASHBOARD");
  };

  const handleClickUploadImagesButton = () => {
    startTransition(async () => {
      const loadingToast = toast.loading(
        editingProjectId ? "Updating project..." : "Creating project..."
      );

      try {
        let finalImageUrl = imageUrls[0];

        if (imageUrls[0]?.startsWith("blob:")) {
          const imageFile = await convertBlobUrlToFile(imageUrls[0]);
          const { imageUrl, error } = await uploadImage({
            file: imageFile,
            bucket: "jenga-log",
          });
          if (error) throw new Error(error);
          finalImageUrl = imageUrl;
        }

        const projectData = {
          name: projectName,
          notes: notes,
          image_url: finalImageUrl,
          client_name: clientName,
          folders: folders,
        };

        const { data, error } = editingProjectId
          ? await supabase
              .from("projects")
              .update(projectData)
              .eq("id", editingProjectId)
              .select()
              .single()
          : await supabase
              .from("projects")
              .insert([projectData])
              .select()
              .single();

        if (error) throw error;

        setProjects((prev) =>
          editingProjectId
            ? prev.map((p) => (p.id === data.id ? data : p))
            : [data, ...prev]
        );

        toast.success(
          editingProjectId ? "Project updated!" : "Project created!",
          { id: loadingToast }
        );
        resetForm();
      } catch (error: any) {
        toast.error(error.message || "An error occurred", { id: loadingToast });
      }
    });
  };

  const ProgressBar = ({ stepIndex }: { stepIndex: number }) => (
    <div className="flex items-center justify-between w-full max-w-3xl mb-12 relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -z-10" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-amber-400 transition-all duration-300 -z-10"
        style={{ width: `${(stepIndex / 2) * 100}%` }}
      />
      {["Project Name", "Upload Plans", "Finalize"].map((label, i) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              i <= stepIndex ? "bg-amber-400" : "bg-gray-600"
            }`}
          />
          <span
            className={`text-[12px] mt-2 font-medium ${
              i <= stepIndex ? "text-amber-400" : "text-gray-500"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-4 md:p-8">
      <main className="max-w-6xl mx-auto">
        {currentStep === "DASHBOARD" ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <h1 className="text-2xl font-bold">Projects</h1>
              <div className="flex w-full md:w-auto gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 focus:border-amber-400 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => setCurrentStep("PROJECT_NAME")}
                className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <Plus size={20} /> NEW PROJECT
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-800"
                >
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(project);
                      }}
                      className="p-2 bg-blue-500 hover:bg-amber-400 hover:text-black rounded-full backdrop-blur-md transition-colors"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(project.id);
                      }}
                      className="p-2 bg-blue-500 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="aspect-square bg-gray-800">
                    <img
                      src={
                        project.image_url || "https://via.placeholder.com/400"
                      }
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 border-t border-gray-800/50">
                    <h3 className="font-semibold text-sm truncate text-gray-200">
                      {project.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider mt-1 text-gray-500">
                      {new Date(project.created_at).toLocaleDateString(
                        undefined,
                        { dateStyle: "medium" }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-20 bg-[#1e1e1e] rounded-2xl border border-dashed border-gray-800">
                <p className="text-gray-500">
                  No projects found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center pt-4">
            <h2 className="text-3xl font-bold mb-8 self-start text-gray-300">
              {currentStep === "PROJECT_NAME"
                ? "Start New Project"
                : projectName}
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

            <div className="w-full max-w-2xl bg-[#1e1e1e] p-8 rounded-2xl border border-gray-800 shadow-2xl">
              {currentStep === "PROJECT_NAME" && (
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-300">
                    Project Name
                  </label>
                  <input
                    autoFocus
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Riverside Apartment"
                    className="w-full bg-transparent border-b-2 border-gray-800 py-3 text-2xl focus:border-amber-400 outline-none transition-all"
                  />
                </div>
              )}

              {currentStep === "PLAN_SETUP" && (
                <div className="text-center">
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 rounded-2xl p-12 hover:border-amber-400 hover:bg-amber-400/5 cursor-pointer transition-all"
                  >
                    <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-lg font-medium">
                      Click to upload images
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      You can select multiple files
                    </p>
                    <input
                      type="file"
                      ref={imageInputRef}
                      multiple
                      hidden
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="mt-6 grid grid-cols-4 gap-2">
                      {imageUrls.map((url, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-700"
                        >
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePreviewImage(i);
                            }}
                            className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentStep === "FOLDERS" && (
                <div className="space-y-8">
                  <section>
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2 mb-4">
                      <ImageIcon size={14} /> Project Gallery (
                      {imageUrls.length} images)
                    </label>
                    <div className="bg-black/20 p-4 rounded-xl grid grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-800">
                      {imageUrls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </section>

                  <section className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">
                      Project Notes
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add specific instructions or descriptions..."
                      className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-sm focus:ring-1 focus:ring-amber-400 outline-none"
                    />
                  </section>
                </div>
              )}

              {/* <div className="flex gap-4 mt-10">
                <button
                  onClick={resetForm}
                  className="flex-1 py-4  mt-4 bg-amber-400 text-black rounded-xl font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (currentStep === "PROJECT_NAME") {
                      if (!projectName.trim()) return;
                      setCurrentStep("PLAN_SETUP");
                    } else if (currentStep === "PLAN_SETUP") {
                      if (imageUrls.length === 0)
                        return alert("Upload at least one image");
                      setCurrentStep("FOLDERS");
                    } else {
                      handleClickUploadImagesButton();
                    }
                  }}
                  disabled={isPending}
                  className="flex-1 py-4 mt-4 bg-amber-400 text-black rounded-xl font-bold hover:bg-amber-500 transition"
                >
                  {isPending
                    ? "Processing..."
                    : currentStep === "FOLDERS"
                    ? "Complete Project"
                    : "Next Step"}
                </button>
              </div> */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => {
                    if (currentStep === "PROJECT_NAME") {
                      resetForm();
                    } else if (currentStep === "PLAN_SETUP") {
                      setCurrentStep("PROJECT_NAME");
                    } else if (currentStep === "FOLDERS") {
                      setCurrentStep("PLAN_SETUP");
                    }
                  }}
                  className="flex-1 py-4 mt-4 bg-amber-400 text-black rounded-xl font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest text-sm"
                >
                  {currentStep === "PROJECT_NAME" ? "Cancel" : "Back"}
                </button>

                <button
                  onClick={() => {
                    if (currentStep === "PROJECT_NAME") {
                      if (!projectName.trim()) return;
                      setCurrentStep("PLAN_SETUP");
                    } else if (currentStep === "PLAN_SETUP") {
                      if (imageUrls.length === 0)
                        return alert("Upload at least one image");
                      setCurrentStep("FOLDERS");
                    } else {
                      handleClickUploadImagesButton();
                    }
                  }}
                  disabled={isPending}
                  className="flex-1 py-4 mt-4 bg-amber-400 text-black rounded-xl font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest text-sm disabled:opacity-50"
                >
                  {isPending
                    ? "Processing..."
                    : currentStep == "FOLDERS"
                    ? "Complete Project"
                    : "Next Step"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
