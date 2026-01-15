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
import { toast } from "sonner";

type Step =
  | "DASHBOARD"
  | "PROJECT_NAME"
  | "PLAN_SETUP"
  | "FOLDERS"
  | "VIEW_PROJECT";

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
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

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

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setCurrentStep("VIEW_PROJECT");
  };

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
    setImageUrls(
      project.image_urls || (project.image_url ? [project.image_url] : [])
    );
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
    setEditingProjectId(null);
    setCurrentStep("DASHBOARD");
  };

  const handleClickUploadImagesButton = () => {
    startTransition(async () => {
      const loadingToast = toast.loading("Processing project...");
      try {
        const finalImageUrls: string[] = [];
        for (const url of imageUrls) {
          if (url.startsWith("blob:")) {
            const imageFile = await convertBlobUrlToFile(url);
            const { imageUrl, error } = await uploadImage({
              file: imageFile,
              bucket: "jenga-log",
            });
            if (error) throw new Error(error);
            finalImageUrls.push(imageUrl);
          } else {
            finalImageUrls.push(url);
          }
        }

        const projectData = {
          name: projectName,
          notes: notes,
          image_url:
            finalImageUrls.length > 0
              ? finalImageUrls[0]
              : "https://via.placeholder.com/400",
          image_urls: finalImageUrls,
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

  const downloadImage = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  const ProgressBar = ({ stepIndex }: { stepIndex: number }) => (
    <div className="flex items-center justify-between w-full max-w-3xl mb-12 relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -z-10" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 transition-all duration-300 -z-10"
        style={{ width: `${(stepIndex / 2) * 100}%` }}
      />
      {["Project Name", "Upload Plans", "Finalize"].map((label, i) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              i <= stepIndex ? "bg-emerald-500" : "bg-gray-600"
            }`}
          />
          <span
            className={`text-[12px] mt-2 font-medium ${
              i <= stepIndex ? "text-emerald-500" : "text-gray-500"
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
                    className="w-full bg-[#1e1e1e] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => setCurrentStep("PROJECT_NAME")}
                className="bg-emerald-500 hover:bg-emerald-500 text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <Plus size={20} /> NEW PROJECT
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleViewProject(project)}
                  className="group relative bg-[#1e1e1e] cursor-pointer rounded-xl overflow-hidden border border-gray-800"
                >
                  <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(project);
                      }}
                      className="p-2 bg-blue-500 hover:bg-emerald-500 hover:text-black rounded-full transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(project.id);
                      }}
                      className="p-2 bg-blue-500 hover:bg-red-500 text-white rounded-full transition-colors"
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
          </div>
        ) : currentStep === "VIEW_PROJECT" ? (
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setCurrentStep("DASHBOARD")}
              className="text-emerald-500 mb-6 flex items-center gap-2 hover:underline"
            >
              ← Back to Dashboard
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <h1 className="text-4xl font-bold text-white">
                  {selectedProject?.name}
                </h1>
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">
                    Notes
                  </h4>
                  <p className="text-gray-300">
                    {selectedProject?.notes || "No notes."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-widest">
                  Project Files (
                  {
                    (
                      selectedProject?.image_urls || [
                        selectedProject?.image_url,
                      ]
                    ).length
                  }
                  )
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(
                    selectedProject?.image_urls || [selectedProject?.image_url]
                  ).map((url: string, index: number) => (
                    <div
                      key={index}
                      className="group relative aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
                    >
                      <img
                        src={url}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        alt="project file"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() =>
                            downloadImage(
                              url,
                              `${selectedProject.name}-${index}.jpg`
                            )
                          }
                          className="bg-emerald-500 text-black p-2 rounded-full hover:bg-emerald-500 transition-colors"
                        >
                          <Upload size={20} className="rotate-180" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-4">
            <h2 className="text-3xl font-bold mb-8 self-start text-gray-300">
              {editingProjectId ? "Edit Project" : "Start New Project"}
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
                    className="w-full bg-transparent border-b-2 border-gray-800 py-3 text-2xl focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              )}
              {currentStep === "PLAN_SETUP" && (
                <div className="text-center">
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 rounded-2xl p-12 hover:border-emerald-500 hover:bg-emerald-500/5 cursor-pointer transition-all"
                  >
                    <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-lg font-medium">
                      Click to upload images
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
                          key={url}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-700"
                        >
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                            alt="preview"
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
                          alt="gallery"
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
                      placeholder="Add specific instructions..."
                      className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </section>
                </div>
              )}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => {
                    if (currentStep === "PROJECT_NAME") resetForm();
                    else if (currentStep === "PLAN_SETUP")
                      setCurrentStep("PROJECT_NAME");
                    else if (currentStep === "FOLDERS")
                      setCurrentStep("PLAN_SETUP");
                  }}
                  className="flex-1 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors uppercase tracking-widest text-sm"
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
                    } else handleClickUploadImagesButton();
                  }}
                  disabled={isPending}
                  className="flex-1 py-4 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-500 transition-colors uppercase tracking-widest text-sm disabled:opacity-50"
                >
                  {isPending
                    ? "Processing..."
                    : currentStep === "FOLDERS"
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
