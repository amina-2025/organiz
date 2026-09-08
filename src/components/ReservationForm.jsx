"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuxButton, LuxField } from "@/components/lux";

export function ReservationForm({ eventId, slug, user, reservation }) {
  const router = useRouter();
  const [participantType, setParticipantType] = useState("Visiteur");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (reservation) {
    return (
      <div className="border border-border p-6">
        <p className="text-lg">Réservation confirmée</p>
        <p className="mt-3 text-sm text-muted-foreground">{user.name} · {reservation.participantType}</p>
        {reservation.company ? <p className="mt-1 text-sm text-muted-foreground">{reservation.company}</p> : null}
      </div>
    );
  }

  if (!user) {
    const redirect = encodeURIComponent(`/e/${slug}`);
    return (
      <div className="border border-border p-6">
        <p>La réservation nécessite un compte.</p>
        <div className="mt-5 flex gap-5 text-sm">
          <Link className="text-primary hover:opacity-70" href={`/login?redirect=/e/${slug}`}>Connexion</Link>
          <Link className="text-primary hover:opacity-70" href={`/register?redirect=${redirect}`}>Créer un compte</Link>
        </div>
      </div>
    );
  }

  async function reserve(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/events/${eventId}/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participant_type: participantType, company }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Une erreur est survenue.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={reserve} className="border border-border p-6">
      <label htmlFor="participant_type" className="eyebrow mb-3 block">Type de participant</label>
      <select id="participant_type" value={participantType} onChange={(e) => setParticipantType(e.target.value)} className="w-full border-b border-border bg-transparent py-3 outline-none">
        <option>Visiteur</option>
        <option>Startup</option>
        <option>Investisseur</option>
      </select>
      <div className="mt-8">
        <LuxField id="company" label="Entreprise ou projet (optionnel)" maxLength={140} value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      {error ? <p className="mt-5 text-sm text-red-300">{error}</p> : null}
      <LuxButton type="submit" disabled={busy} className="mt-8 rounded-md">
        {busy ? "Réservation…" : "Réserver ma place"}
      </LuxButton>
    </form>
  );
}