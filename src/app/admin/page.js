import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/lux";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");

  let stats = {
    userCount: null,
    eventCount: null,
    reservationCount: null,
    recentUsers: [],
    databaseError: false,
  };

  try {
    const [userCount, eventCount, reservationCount, recentUsers] = await prisma.$transaction([
      prisma.user.count(),
      prisma.event.count(),
      prisma.reservation.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { name: true, email: true, role: true, createdAt: true },
      }),
    ]);
    stats = { userCount, eventCount, reservationCount, recentUsers, databaseError: false };
  } catch (error) {
    console.error("Admin data load failed:", error);
    stats.databaseError = true;
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <Eyebrow>Administration</Eyebrow>
        <h1 className="mt-6 text-4xl">Espace administrateur</h1>

        {stats.databaseError ? (
          <p className="mt-10 border-y border-border py-5 text-muted-foreground">
            Les données sont temporairement indisponibles. Réessayez dans quelques instants.
          </p>
        ) : null}

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Stat label="Utilisateurs" value={stats.userCount ?? "—"} />
          <Stat label="Événements" value={stats.eventCount ?? "—"} />
          <Stat label="Réservations" value={stats.reservationCount ?? "—"} />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl">Utilisateurs récents</h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {stats.recentUsers.map((member) => (
              <div key={member.email} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <p>{member.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{member.role}</p>
                  <p className="mt-1">{member.createdAt.toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
            ))}
            {!stats.databaseError && stats.recentUsers.length === 0 ? (
              <p className="py-5 text-muted-foreground">Aucun utilisateur récent.</p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border-b border-border pb-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 text-4xl">{value}</p>
    </div>
  );
}