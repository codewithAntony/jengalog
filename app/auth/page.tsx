import AuthClientPage from "./auth-client";
import { createSupabaseServerClient } from "@/lib/supabase/sever-client";

export default async function AuthPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log({ user });
  return <AuthClientPage user={user} />;
}
