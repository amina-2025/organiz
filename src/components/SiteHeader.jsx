"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";

export function SiteHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <div>
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.22em]"
          >
            confluiince
          </Link>
        </div>

        <nav className="flex items-center gap-8">
          <Link
            href="/events"
            className="text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Événements
          </Link>
          {user ? (
            <>
              <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-300 hover:text-foreground">
                {user.role === "ADMIN" ? "Administration" : "Mon espace"}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-300 hover:text-foreground">
                Se connecter
              </Link>
              <Link href="/register" className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm">
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}