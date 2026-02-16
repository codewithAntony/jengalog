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
  User,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { convertBlobUrlToFile } from "@/lib/utils/convertBlobUrlToFile";
import { uploadImage } from "@/lib/supabase/storage/client";
import { toast } from "sonner";
import Camera from "@/app/components/admin/Camera";

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

  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  const [notes, setNotes] = useState("");
  const [folders, setFolders] = useState<string[]>(["General"]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .eq("role", "client");

      if (error) console.error("Error fetching clients:", error);
      if (data) setAvailableClients(data);
    };
    fetchClients();
  }, [supabase]);

  useEffect(() => {
    const fetchProjects = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) console.error("Error fetching projects:", error);
        else if (data) setProjects(data);
      }
    };
    fetchProjects();
  }, [supabase]);

  const resetForm = () => {
    setProjectName("");
    setSelectedClientId("");
    setNotes("");
    setFolders(["General"]);
    setImageUrls([]);
    setEditingProjectId(null);
    setCurrentStep("DASHBOARD");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setCurrentStep("VIEW_PROJECT");
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toast.warning("Delete Project", {
      description: "Are you sure? This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);
          if (error) {
            toast.error("Failed to delete project.");
          } else {
            setProjects((prev) => prev.filter((p) => p.id !== id));
            toast.success("Project deleted successfully");
          }
        },
      },
    });
  };

  const handleEditClick = (e: React.MouseEvent, project: any) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setProjectName(project.name);
    setSelectedClientId(project.client_id || "");
    setNotes(project.notes);
    setImageUrls(
      project.image_urls || (project.image_url ? [project.image_url] : []),
    );
    setCurrentStep("PROJECT_NAME");
  };

  const removePreviewImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    toast.info("Scan removed");
  };

  const handleClickUploadImagesButton = () => {
    startTransition(async () => {
      const loadingToast = toast.loading("Creating Project...");
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be logged in to save projects");
          return;
        }

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

        const selectedClient = availableClients.find(
          (c) => c.id === selectedClientId,
        );

        const projectData = {
          name: projectName,
          user_id: user.id,
          client_id: selectedClientId || null,
          client_name: selectedClient
            ? `${selectedClient.first_name} ${selectedClient.last_name}`
            : "Unassigned",
          notes: notes,
          image_url: finalImageUrls[0] || "https://via.placeholder.com/400",
          image_urls: finalImageUrls,
          folders: folders,
        };

        const { data, error } = editingProjectId
          ? await supabase
              .from("projects")
              .update(projectData)
              .eq("id", editingProjectId)
              .eq("user_id", user.id) // Extra safety: ensure I own what I'm editing
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
            : [data, ...prev],
        );

        toast.success(
          editingProjectId ? "Project updated!" : "Project created!",
          { id: loadingToast },
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
      {["Project Info", "Upload Plans", "Finalize"].map((label, i) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className={`w-4 h-4 rounded-full ${i <= stepIndex ? "bg-emerald-500" : "bg-gray-600"}`}
          />
          <span
            className={`text-[12px] mt-2 font-medium ${i <= stepIndex ? "text-emerald-500" : "text-gray-500"}`}
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
                className="bg-emerald-500 hover:bg-emerald-500 disabled:bg-emerald-800 text-[#05130d] font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <Plus size={20} /> NEW PROJECT
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {projects
                .filter((p) =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentStep("VIEW_PROJECT");
                    }}
                    className="group relative bg-[#1e1e1e] cursor-pointer rounded-xl overflow-hidden border border-gray-800"
                  >
                    {/* Action Overlay Icons */}
                    <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditClick(e, project)}
                        className="p-2 bg-black/60 hover:bg-emerald-500 text-white hover:text-black rounded-full transition-colors shadow-lg"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, project.id)}
                        className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg"
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
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">
                        {project.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 uppercase mt-1">
                        {project.client_name || "No Client"}
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
              className="text-emerald-500 mb-6 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold mb-4">{selectedProject?.name}</h1>
            <p className="text-gray-400 mb-8">{selectedProject?.notes}</p>
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
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest">
                      Client Name
                    </label>
                    <input
                      autoFocus
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-transparent border-b-2 border-gray-800 py-3 text-2xl focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  {/* <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={16} /> Assign to Registered Client
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-white focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="">-- Choose Client --</option>
                      {availableClients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.email}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>
              )}

              {currentStep === "PLAN_SETUP" && (
                <div className="space-y-8">
                  {/** Take picture and upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center shadow-inner">
                      <Camera
                        mode="IMAGE"
                        onCapture={(url) =>
                          setImageUrls((prev) => [...prev, url])
                        }
                      />
                      {/* <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">
                        Live Capture
                      </p> */}
                    </div>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="bg-[#1a1a1a] border-2 border-dashed border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-50 hover:bg-emerald-500/5 transition-all group"
                    >
                      <div className="p-4 bg-gray-800 rounded-full mb-4 group-hover:bg-emerald-500/10 transition-colors">
                        <Upload
                          size={32}
                          className="text-gray-500 group-hover:text-emerald-500"
                        />
                      </div>

                      <span className="text-sm font-bold uppercase tracking-widest text-gray-300">
                        Upload Files
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Select from your device
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
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="pt-4 border-t border-gray-800">
                      <label className="text-[-10px] font-bold uppercase text-emerald-500 tracking-widest mb-3 block">
                        Selected Images ({imageUrls.length})
                      </label>

                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {imageUrls.map((url, i) => (
                          <div
                            key={url}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 bg-black cursor-pointer"
                            onClick={() => setSelectedImageUrl(url)}
                          >
                            <img
                              src={url}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removePreviewImage(i)}
                              className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === "FOLDERS" && (
                <div className="space-y-6">
                  <label className="text-xs font-bold uppercase text-gray-500 tracking-widest block">
                    Project Documentation
                  </label>

                  <div className="relative w-full min-h-[200px] bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 overflow-hidden flex flex-col items-center justify-center group transition-all hover:bg-emerald-500/50">
                    <Camera
                      mode="SCAN"
                      onCapture={(url) => {
                        setImageUrls((prev) => [...prev, url]);
                        toast.success("Note scanned successfully");
                      }}
                    />
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 group-hover:text-emerald-500 transition-colors">
                      Scan handwritten Notes to PDF
                    </p>
                  </div>

                  {/** Google Drive Gallery */}
                  {imageUrls.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="tex-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
                          Scanned Documents ({imageUrls.length})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative group bg-white p-1 rounded shadow-xl aspect-[3/4] overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer"
                            onClick={() => setSelectedImageUrl(url)}
                          >
                            <div className="w-full h-full bg-white border border-gray-200 overflow-hidden relative">
                              <img
                                src={url}
                                alt={`Scan ${index}`}
                                className="object-cover w-full h-full"
                              />

                              <button
                                onClick={() => removePreviewImage(index)}
                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X size={12} />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 py-1 px-2">
                                <p className="text-[8px] text-white font-bold truncate tracking-tighter uppercase">
                                  SCAN_{String(index + 1).padStart(3, "0")}.pdf
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">
                      Additional Text Notes
                    </label>
                    <textarea
                      rows={6}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Type specific instructions or context for the scanned notes..."
                      className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
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
                      if (!projectName.trim())
                        return toast.error("Please enter a project name");
                      setCurrentStep("PLAN_SETUP");
                    } else if (currentStep === "PLAN_SETUP") {
                      if (imageUrls.length === 0)
                        return toast.error("Upload at least one image");
                      setCurrentStep("FOLDERS");
                    } else handleClickUploadImagesButton();
                  }}
                  disabled={isPending}
                  className="flex-1 py-4 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-600 transition-colors uppercase tracking-widest text-sm disabled:opacity-50"
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
        {/** Lightbox Modal */}
        {selectedImageUrl && (
          <div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
            onClick={() => setSelectedImageUrl(null)}
          >
            <button
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setSelectedImageUrl(null)}
            >
              <X size={24} />
            </button>

            <div className="relative max-w-5xl max-h-full flex items-center justify-center">
              <img
                src={selectedImageUrl}
                alt="Full Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
