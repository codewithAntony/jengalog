"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseBrowserClient } from "../supabase/browser-client";
import { createSupabaseServerClient } from "../supabase/server-client";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  const supabase = getSupabaseBrowserClient();

  await supabase.auth.signOut();

  redirect("/auth");
}

export async function createEmployee(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const roleId = formData.get("roleId") as string;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("employees")
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        role_id: parseInt(roleId),
        is_active: true,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/employees");

  return { success: true };
}
