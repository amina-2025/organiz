import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/lux";
import { ReservationForm } from "@/components/ReservationForm";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }) {
  const event = await prisma.event.findUnique({ where: { slug: (await params).slug } });
  if (!event) notFound();

  const user = await getCurrentUser();
  const reservation = user
    ? await prisma.reservation.findUnique({ where: { eventId_userId: { eventId: event.id, userId: user.id } } })
    : null;

  return (
    <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-3xl px-6 py-20 md:px-10">
      <Eyebrow>Événement privé</Eyebrow><h1 className="mt-6 text-5xl">{event.title}</h1>
      <p className="mt-8 text-lg leading-8 text-muted-foreground">{event.description}</p>
      <div className="mt-8 border-y border-border py-5 text-sm text-muted-foreground">{event.eventDate.toLocaleString("fr-FR")} · {event.location}</div>
      <div className="mt-14"><ReservationForm eventId={event.id} slug={event.slug} user={user} reservation={reservation} /></div>
    </main></div>
  );
}