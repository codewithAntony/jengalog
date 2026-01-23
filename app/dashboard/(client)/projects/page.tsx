import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";
import SiteFeed from "@/app/components/client/SiteFeed";
import React from "react";

export default async function page() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, name")
    .eq("client_id", user.id)
    .single();

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            No Project Found
          </h2>
          <p className="text-slate-500 mt-2">
            Your project hasn't been linked to your account yet.
          </p>
        </div>
      </div>
    );
  }

  const { data: updates, error } = await supabase
    .from("site_updates")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching updates:", error);
    return (
      <div className="p-10 text-center">Error loading project timeline.</div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 mt-1">Live Construction Feed</p>
        </div>
        <SiteFeed updates={updates || []} />
      </div>
    </main>
  );
}
