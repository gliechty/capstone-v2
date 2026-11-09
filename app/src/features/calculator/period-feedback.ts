import { z } from "zod";
import { annualPeriod } from "../../application/calculator-mapping";

// Presentation only. Keep eligibility in the existing annualPeriod rule.
export function periodFeedback(start: string, end: string): string | null {
  if (!z.iso.date().safeParse(start).success || !z.iso.date().safeParse(end).success) return null;
  if (end < start) return "End date must be on or after start date.";
  if (annualPeriod(start, end)) return null;
  const anniversary = new Date(start + "T00:00:00Z");
  anniversary.setUTCFullYear(anniversary.getUTCFullYear() + 1);
  const tooLong = new Date(end + "T00:00:00Z").getTime() >= anniversary.getTime();
  return tooLong
    ? "This period is longer than one year. Use one complete annual reporting period to transfer answers."
    : "This is a partial year. Use one complete annual reporting period to transfer answers; partial periods are not annualized.";
}
