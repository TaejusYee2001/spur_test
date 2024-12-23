import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProtectedContent from "@/components/protected-content";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <ProtectedContent />;
}