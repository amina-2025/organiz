export function makeSlug(title) {
  const base = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "event"}-${crypto.randomUUID().slice(0, 8)}`;
}

export function parseEventDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}