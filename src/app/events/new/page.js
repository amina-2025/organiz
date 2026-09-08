import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/lux";
import { EventForm } from "@/components/EventForm";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/events/new");
  if (user.role !== "ORGANIZER") redirect("/dashboard");

  return (
    <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-2xl px-6 py-20 md:px-10">
      <Eyebrow>Organisation</Eyebrow><h1 className="mt-6 text-4xl">Créer un événement</h1><EventForm />
    </main></div>
  );
}