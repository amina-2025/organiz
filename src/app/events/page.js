import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/lux";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/events");

  let events = [];
  let databaseError = false;

  try {
    events = await prisma.event.findMany({ orderBy: { eventDate: "asc" } });
  } catch (error) {
    console.error("Events page load failed:", error);
    databaseError = true;
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <Eyebrow>Agenda</Eyebrow>
        <h1 className="mt-6 text-4xl">Événements</h1>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {events.map((event) => (
            <Link key={event.id} href={`/e/${event.slug}`} className="border-b border-border pb-8 transition-opacity hover:opacity-70">
              <h2 className="text-2xl">{event.title}</h2>
              <p className="mt-3 text-muted-foreground">{event.description}</p>
              <p className="mt-5 text-sm text-muted-foreground">{event.eventDate.toLocaleString("fr-FR")} · {event.location}</p>
            </Link>
          ))}
        </div>
        {databaseError ? (
          <p className="mt-14 text-muted-foreground">Les événements sont temporairement indisponibles. Réessayez dans un instant.</p>
        ) : events.length === 0 ? (
          <p className="mt-14 text-muted-foreground">Aucun événement pour le moment.</p>
        ) : null}
      </main>
    </div>
  );
}