"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../supabase/server-client";

export async function uploadSiteUpdate(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const projectId = formData.get("projectId") as string;
    const imageFile = formData.get("image") as File;

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized: Please log in.");

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${projectId}/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("project-updates")
      .upload(filePath, imageFile);

    if (storageError) throw new Error(`Storage: ${storageError.message}`);

    const { data: urlData } = supabase.storage
      .from("project-updates")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("site_updates").insert([
      {
        project_id: projectId,
        user_id: user.id,
        title,
        description,
        image_url: urlData.publicUrl,
        milestone_reached: formData.get("isMilestone") === "true",
      },
    ]);

    if (dbError) throw new Error(`Database: ${dbError.message}`);

    revalidatePath("/dashboard/dashboard");

    return { success: true, message: "Update posted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
