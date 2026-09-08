import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/lux";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { DeleteEventButton } from "@/components/DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/dashboard");
  if (user.role === "ADMIN") redirect("/admin");

  const events = await prisma.event.findMany({
    where: { ownerId: user.id },
    orderBy: { eventDate: "asc" },
    include: { _count: { select: { reservations: true } } },
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div><Eyebrow>Tableau de bord</Eyebrow><h1 className="mt-6 text-4xl">Bonjour, {user.name}</h1></div>
          <div className="flex flex-wrap gap-5">
            <Link href="/reservations" className="text-sm text-primary">Mes réservations</Link>
            {user.role === "ORGANIZER" ? (
              <Link href="/events/new" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground">Créer un événement</Link>
            ) : (
              <Link href="/events" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground">Voir les événements</Link>
            )}
          </div>
        </div>
        {user.role !== "ORGANIZER" ? (
          <div className="mt-16 border-t border-border pt-8">
            <p className="text-muted-foreground">Vous êtes participant. Consultez les événements disponibles ou retrouvez vos réservations.</p>
            <Link href="/events" className="mt-5 inline-block text-sm text-primary">Parcourir les événements</Link>
          </div>
        ) : events.length === 0 ? (
          <p className="mt-16 text-muted-foreground">Vous n&apos;avez encore créé aucun événement.</p>
        ) : (
          <div className="mt-16 space-y-6">
            {events.map((event) => (
              <article key={event.id} className="border-b border-border pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><h2 className="text-2xl">{event.title}</h2><p className="mt-2 text-muted-foreground">{event.description}</p></div>
                  <span className="text-sm text-muted-foreground">{event._count.reservations} réservation(s)</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{event.eventDate.toLocaleString("fr-FR")} · {event.location}</p>
                <div className="mt-5 flex flex-wrap gap-5 text-sm">
                  <Link className="text-primary" href={`/e/${event.slug}`}>Voir la page publique</Link>
                  <Link className="text-primary" href={`/events/${event.id}/edit`}>Modifier</Link>
                  <Link className="text-primary" href={`/dashboard/${event.id}/reservations`}>Voir les réservations</Link>
                  <DeleteEventButton eventId={event.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}