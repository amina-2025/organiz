"use client";

import { motion } from "framer-motion";

export function Rule() {
  return <div className="h-px w-full bg-border" />;
}

export function Eyebrow({ children }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </span>
  );
}

export function StepNumber({ children }) {
  return (
    <span className="text-sm font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export function Lede({ children, className = "" }) {
  return (
    <p className={`text-lg leading-8 text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

export function PrimaryLink({ href, children }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        y: -3,
      }}
      whileTap={{
        scale: 0.95,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm"
    >
      {children}
    </motion.a>
  );
}

export function GhostLink({ href, children }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        y: -3,
      }}
      whileTap={{
        scale: 0.95,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="inline-flex items-center rounded-md border border-border px-5 py-3 text-sm font-medium shadow-sm"
    >
      {children}
    </motion.a>
  );
}
// Shared visual components.

export function LuxField({ id, label, type = "text", required, value, onChange, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block mb-3">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b border-border pb-3 text-base outline-none transition-colors duration-500 focus:border-primary"
        {...props}
      />
    </div>
  );
}

export function LuxButton({ children, type = "button", disabled, className = "", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`bg-primary px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-primary-foreground transition-opacity duration-500 hover:opacity-85 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}