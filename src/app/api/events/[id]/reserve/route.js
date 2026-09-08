import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { reservationSchema } from "@/lib/validation";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  try {
    const event = await prisma.event.findUnique({ where: { id: (await params).id }, select: { id: true } });
    if (!event) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });

    const result = reservationSchema.safeParse(await request.json());
    if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const existing = await prisma.reservation.findUnique({
      where: { eventId_userId: { eventId: event.id, userId: user.id } },
    });
    if (existing) return NextResponse.json({ error: "Vous avez déjà réservé cet événement" }, { status: 409 });

    await prisma.reservation.create({
      data: {
        eventId: event.id,
        userId: user.id,
        participantType: result.data.participant_type,
        company: result.data.company || null,
      },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Reservation failed:", error);
    return NextResponse.json({ error: "Impossible de créer la réservation" }, { status: 500 });
  }
}