"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../supabase/server-client";

export async function uploadSiteUpdate(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("projectId") as string;
  const imageFile = formData.get("image") as File;

  const supabase = await createSupabaseServerClient();

  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${projectId}/${fileName}`;

  const { data: storageData, error: storageError } = await supabase.storage
    .from("project-updates")
    .upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    });
  if (storageError) {
    console.error("Storage Error:", storageError);
    throw new Error(`Storage error: ${storageError.message}`);
  }
  const { data: urlData } = supabase.storage
    .from("project-updates")
    .getPublicUrl(filePath);

  const { error: dbError } = await supabase.from("site_updates").insert([
    {
      project_id: projectId,
      title: title,
      description: description,
      image_url: urlData.publicUrl,
      milestone_reached: formData.get("isMilestone") === "true",
    },
  ]);

  if (dbError) {
    console.error("Database Error:", dbError);
    throw new Error(dbError.message);
  }

  revalidatePath("/client/dashboard");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
