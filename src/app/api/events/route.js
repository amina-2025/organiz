import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { eventSchema } from "@/lib/validation";
import { makeSlug, parseEventDate } from "@/lib/events";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        eventType: true,
        eventDate: true,
        location: true,
        slug: true,
      },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events fetch failed:", error);
    return NextResponse.json({ error: "Impossible de charger les événements" }, { status: 503 });
  }
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  if (user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Réservé aux organisateurs" }, { status: 403 });
  }

  try {
    const result = eventSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const eventDate = parseEventDate(result.data.event_date);
    if (!eventDate) return NextResponse.json({ error: "La date est invalide" }, { status: 400 });

    const event = await prisma.event.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        eventType: result.data.event_type,
        eventDate,
        location: result.data.location,
        slug: makeSlug(result.data.title),
        ownerId: user.id,
      },
      select: { id: true, slug: true },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error("Event creation failed:", error);
    return NextResponse.json({ error: "Impossible de créer l'événement" }, { status: 500 });
  }
}