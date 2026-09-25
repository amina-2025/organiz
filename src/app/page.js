// Home page with client-side animations.
"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { Rule, Eyebrow, StepNumber, Lede, PrimaryLink, GhostLink } from "@/components/lux";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function Page() {
  const steps = [
    {
      n: "01",
      t: "Créer",
      d: "Un titre, une description, une date, un lieu. Rien de plus, rien de superflu.",
    },
    {
      n: "02",
      t: "Partager",
      d: "Un lien unique est généré pour votre événement. Vous seul décidez qui le reçoit.",
    },
    {
      n: "03",
      t: "Réserver",
      d: "Vos invités confirment leur présence en indiquant leur profil : visiteur, startup ou investisseur.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <motion.section
          className="py-28 md:py-44"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <Eyebrow>Plateforme d&apos;événements sur invitation</Eyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-10 max-w-3xl text-5xl leading-[1.08] md:text-7xl"
          >
            Recevoir, avec la juste mesure.
          </motion.h1>

          <motion.div variants={fadeUp} transition={{ duration: 0.7 }}>
            <Lede className="mt-10 max-w-xl text-base">
              Créez un événement en quelques instants. Séance génère un lien unique que vous
              partagez à qui vous souhaitez. Aucune liste publique, aucune recherche : seules les
              personnes invitées y accèdent et réservent leur place.
            </Lede>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-14 flex flex-wrap items-center gap-8"
          >
            <PrimaryLink href="/register">Créer un compte</PrimaryLink>
            <GhostLink href="/login">Se connecter</GhostLink>
          </motion.div>
        </motion.section>

        <Rule />

        <motion.section
          className="grid gap-16 py-24 md:grid-cols-3 md:gap-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {steps.map((step) => (
            <motion.div key={step.n} variants={fadeUp} transition={{ duration: 0.6 }}>
              <StepNumber>{step.n}</StepNumber>
              <h2 className="mt-6 text-3xl">{step.t}</h2>
              <Lede className="mt-4">{step.d}</Lede>
            </motion.div>
          ))}
        </motion.section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          <Eyebrow>Organiz — Événements privés</Eyebrow>
        </div>
      </footer>
    </div>
  );
}