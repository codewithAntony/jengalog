"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function InactivityLogout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  const resetTimer = () => {
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(logout, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeRef.current) clearTimeout(timeRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return <>{children}</>;
}
