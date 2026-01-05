"use server";

import { getSupabaseBrowserClient } from "../supabase/browser-client";

export async function handleSignOut() {
  const supabase = getSupabaseBrowserClient();

  await supabase.auth.signOut();

  window.location.href = "/auth";
}
