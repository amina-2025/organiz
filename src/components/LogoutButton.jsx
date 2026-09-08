"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const response = await fetch("/api/logout", { method: "POST" });
    if (!response.ok) {
      toast.error("Impossible de se déconnecter.");
      return;
    }

    toast.success("Vous êtes déconnecté.");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
    >
      Se déconnecter
    </button>
  );
}
