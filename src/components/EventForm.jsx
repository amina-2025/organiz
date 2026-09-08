"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuxButton, LuxField } from "@/components/lux";
import { toast } from "sonner";

const EVENT_TYPES = [
  ["CONFERENCE", "Conférence"],
  ["RENCONTRE_ETUDE", "Rencontre d'étude"],
  ["ATELIER", "Atelier"],
  ["SEMINAIRE", "Séminaire"],
  ["AUTRE", "Autre"],
];

export function EventForm({ event }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    event_type: event?.eventType || "CONFERENCE",
    event_date: event?.eventDate
      ? new Date(event.eventDate).toISOString().slice(0, 16)
      : "",
    location: event?.location || "",
  });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(eventObject) {
    eventObject.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch(event ? `/api/events/${event.id}` : "/api/events", {
      method: event ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.error || "Une erreur est survenue.";
      setError(message);
      toast.error(message);
      setBusy(false);
      return;
    }

    toast.success(event ? "Événement modifié avec succès." : "Événement créé avec succès.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-12 space-y-8">
      <LuxField id="title" label="Titre" required value={form.title} onChange={(e) => update("title", e.target.value)} />
      <div>
        <label htmlFor="event_type" className="eyebrow mb-3 block">Type d&apos;événement</label>
        <select
          id="event_type"
          required
          value={form.event_type}
          onChange={(e) => update("event_type", e.target.value)}
          className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-primary"
        >
          {EVENT_TYPES.map(([value, label]) => <option key={value} value={value} className="bg-background">{label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="eyebrow mb-3 block">Description</label>
        <textarea
          id="description"
          required
          maxLength={5000}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="min-h-32 w-full resize-y border-b border-border bg-transparent pb-3 outline-none focus:border-primary"
        />
      </div>
      <LuxField id="event_date" label="Date et heure" type="datetime-local" required value={form.event_date} onChange={(e) => update("event_date", e.target.value)} />
      <LuxField id="location" label="Lieu" required value={form.location} onChange={(e) => update("location", e.target.value)} />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <LuxButton type="submit" disabled={busy} className="rounded-md">
        {busy ? "Enregistrement…" : event ? "Enregistrer les modifications" : "Créer l'événement"}
      </LuxButton>
    </form>
  );
}