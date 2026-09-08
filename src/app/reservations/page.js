import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/lux";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/reservations");

  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      event: { select: { title: true, slug: true, eventDate: true, location: true } },
    },
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-20 md:px-10">
        <Eyebrow>Votre espace</Eyebrow>
        <h1 className="mt-6 text-4xl">Mes réservations</h1>
        <div className="mt-14 space-y-6">
          {reservations.map((reservation) => (
            <Link key={reservation.id} href={`/e/${reservation.event.slug}`} className="block border-b border-border pb-6 transition-opacity hover:opacity-70">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2 className="text-2xl">{reservation.event.title}</h2>
                <span className="text-sm text-primary">{reservation.participantType}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{reservation.event.eventDate.toLocaleString("fr-FR")} · {reservation.event.location}</p>
              {reservation.company ? <p className="mt-2 text-sm text-muted-foreground">{reservation.company}</p> : null}
            </Link>
          ))}
          {reservations.length === 0 ? <p className="text-muted-foreground">Vous n&apos;avez encore aucune réservation.</p> : null}
        </div>
      </main>
    </div>
  );
}