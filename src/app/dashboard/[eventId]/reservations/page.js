import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/lux";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReservationsPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const event = await prisma.event.findFirst({
    where: { id: (await params).eventId, ownerId: user.id },
    include: { reservations: { include: { user: { select: { name: true, email: true } }, }, orderBy: { createdAt: "asc" } } },
  });
  if (!event) notFound();

  return (
    <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-5xl px-6 py-20 md:px-10">
      <Link href="/dashboard" className="text-sm text-primary">← Dashboard</Link>
      <Eyebrow>Réservations</Eyebrow><h1 className="mt-6 text-4xl">{event.title}</h1>
      <div className="mt-12 space-y-5">
        {event.reservations.map((reservation) => <div key={reservation.id} className="border-b border-border pb-5"><p>{reservation.user.name}</p><p className="mt-1 text-sm text-muted-foreground">{reservation.user.email} · {reservation.participantType}{reservation.company ? ` · ${reservation.company}` : ""}</p></div>)}
        {event.reservations.length === 0 ? <p className="text-muted-foreground">Aucune réservation pour le moment.</p> : null}
      </div>
    </main></div>
  );
}