// lib/validation.js

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court."),
  email: z.string().trim().toLowerCase().email("L'adresse e-mail est invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre."),
  role: z.enum(["PARTICIPANT", "ORGANIZER"]).default("PARTICIPANT"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("L'adresse e-mail est invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2, "Le titre est requis").max(160),
  description: z.string().trim().min(2, "La description est requise").max(5000),
  event_type: z.enum(["CONFERENCE", "RENCONTRE_ETUDE", "ATELIER", "SEMINAIRE", "AUTRE"], {
    message: "Le type d'événement est requis",
  }),
  event_date: z.string().min(1, "La date est requise"),
  location: z.string().trim().min(2, "Le lieu est requis").max(240),
});

export const reservationSchema = z.object({
  participant_type: z.enum(["Visiteur", "Startup", "Investisseur"]),
  company: z.string().trim().max(140, "Le nom est trop long").optional().or(z.literal("")),
});