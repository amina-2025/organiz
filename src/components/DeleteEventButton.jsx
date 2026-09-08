"use client";

import { useRouter } from "next/navigation";
import { LuxButton } from "@/components/lux";

export function DeleteEventButton({ eventId }) {
  const router = useRouter();

  async function remove() {
    if (!window.confirm("Supprimer cet événement et ses réservations ?")) return;
    const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  return <LuxButton type="button" onClick={remove} className="rounded-md bg-transparent px-0 text-red-300">Supprimer</LuxButton>;
}