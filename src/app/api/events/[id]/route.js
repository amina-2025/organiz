import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { eventSchema } from "@/lib/validation";
import { parseEventDate } from "@/lib/events";

async function ownedEvent(id, userId) {
  return prisma.event.findFirst({ where: { id, ownerId: userId } });
}

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  if (user.role !== "ORGANIZER") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    const event = await ownedEvent((await params).id, user.id);
    if (!event) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });

    const result = eventSchema.safeParse(await request.json());
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    const eventDate = parseEventDate(result.data.event_date);
    if (!eventDate) return NextResponse.json({ error: "La date est invalide" }, { status: 400 });

    await prisma.event.update({
      where: { id: event.id },
      data: {
        title: result.data.title,
        description: result.data.description,
        eventType: result.data.event_type,
        eventDate,
        location: result.data.location,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event update failed:", error);
    return NextResponse.json({ error: "Impossible de modifier l'événement" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  if (user.role !== "ORGANIZER") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    const event = await ownedEvent((await params).id, user.id);
    if (!event) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    await prisma.event.delete({ where: { id: event.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event deletion failed:", error);
    return NextResponse.json({ error: "Impossible de supprimer l'événement" }, { status: 500 });
  }
}