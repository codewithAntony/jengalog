import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import AdminForm from "./AdminForm";

export default async function AdminPostUpdatePage() {
  const supabase = await createSupabaseServerClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
    id,
    name,
    location,
    client_id,
    profiles!projects_client_id_fkey (
      first_name,
      last_name
    )
  `,
    )
    .eq("status", "ongoing");
  if (error) {
    console.error("Error fetching projects:", error);
    return <div>Error loading projects.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <AdminForm projects={projects || []} />
    </div>
  );
}
