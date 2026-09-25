// Root layout: server component responsible for metadata.
import "./globals.css";
import { Toaster } from "@/components/Toaster";

export const metadata = {
  title: "Confluiince — Créez et partagez vos événements privés",
  description:
    "confluiince est une plateforme d'événements confidentielle : créez un événement, partagez son lien unique, recevez les réservations.",
  openGraph: {
    title: "Confluiince — Événements privés sur invitation",
    description:
      "Créez un événement, partagez son lien unique, recevez les réservations. Sans bruit, sans liste publique.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}<Toaster /></body>
    </html>
  );
}