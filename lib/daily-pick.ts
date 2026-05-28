import seedrandom from "seedrandom";

export function getDateKey(timeZone: string = process.env.APP_TIMEZONE || "America/Santiago"): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

export function pickIndexForDay<T>(items: T[], dateKey: string = getDateKey()): number {
  if (items.length === 0) return -1;
  const rng = seedrandom(dateKey);
  return Math.floor(rng() * items.length);
}

export function pickMessageForDay(messages: string[], dateKey: string = getDateKey()): string {
  if (messages.length === 0) return "";
  const rng = seedrandom(`msg-${dateKey}`);
  return messages[Math.floor(rng() * messages.length)];
}

export function formatHumanDate(dateKey: string = getDateKey(), locale: string = "es-ES"): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}
