import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "gt27-admin";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem(KEY) === "1");
  }, []);

  async function signIn(passcode: string) {
    const { data } = await supabase.from("settings").select("value").eq("key", "admin").maybeSingle();
    const expected = (data?.value as { passcode?: string } | null)?.passcode ?? "aroeira2027";
    if (passcode.trim() === expected) {
      localStorage.setItem(KEY, "1");
      setIsAdmin(true);
      return true;
    }
    return false;
  }

  function signOut() {
    localStorage.removeItem(KEY);
    setIsAdmin(false);
  }

  return { isAdmin, signIn, signOut };
}
