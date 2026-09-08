// app/register/page.js
"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { LuxButton, LuxField, Eyebrow } from "@/components/lux";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTICIPANT");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      }),
    });

    const responseText = await res.text();
    let data = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = {};
    }

    setBusy(false);

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      return;
    }

    if (redirect && redirect.startsWith("/")) {
      window.location.href = redirect;
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen">
      
      <main className="mx-auto max-w-md px-6 py-24 md:py-32">
        <Eyebrow>Nouveau compte</Eyebrow>
        <h1 className="mt-8 text-4xl">Créer un compte</h1>

        <form onSubmit={onSubmit} className="mt-14 space-y-10">
          <LuxField
            id="name"
            label="Nom complet"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <LuxField
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LuxField
            id="password"
            label="Mot de passe"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <label htmlFor="role" className="eyebrow mb-3 block">Type de compte</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-primary"
            >
              <option value="PARTICIPANT">Participant</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <LuxButton type="submit" disabled={busy} className="w-full rounded-md ">
            {busy ? "Création…" : "Créer un compte"}
          </LuxButton>
        </form>

        <p className="mt-10 text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link
            href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
            className="text-primary transition-opacity hover:opacity-70"
          >
            Se connecter
          </Link>
        </p>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}