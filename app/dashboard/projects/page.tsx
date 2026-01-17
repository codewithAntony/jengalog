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

  const { data: profile } = await supabase
    .from("profiles")
    .select("project_id")
    .eq("id", user.id)
    .single();

  if (!profile?.project_id) {
    return <div className="p-10 text-center">No project assigned yet.</div>;
  }

  const { data: updates, error } = await supabase
    .from("site_updates")
    .select("*")
    .eq("project_id", profile.project_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching updates:", error);
    return <div>Error loading project timeline.</div>;
  }
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto">
        <SiteFeed updates={updates || []} />
      </div>
    </main>
  );
}
