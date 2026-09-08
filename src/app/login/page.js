// app/login/page.js
"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { LuxButton, LuxField, Eyebrow } from "@/components/lux";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    setBusy(false);

    if (!res.ok) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    const data = await res.json();

    if (data.redirect === "/admin") {
      router.push("/admin");
      router.refresh();
    } else if (redirect && redirect.startsWith("/")) {
      window.location.href = redirect;
    } else {
      router.push(data.redirect || "/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen">
      
      <main className="mx-auto max-w-md px-6 py-24 md:py-32">
        <Eyebrow>Votre compte</Eyebrow>
        <h1 className="mt-8 text-4xl">Se connecter</h1>

        <form onSubmit={onSubmit} className="mt-14 space-y-10">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <LuxButton type="submit" disabled={busy} className="w-full rounded-md ">
            {busy ? "Connexion…" : "Se connecter"}
          </LuxButton>
        </form>

        <p className="mt-10 text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link
            href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}
            className="text-primary transition-opacity hover:opacity-70"
          >
            Créer un compte
          </Link>
        </p>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}