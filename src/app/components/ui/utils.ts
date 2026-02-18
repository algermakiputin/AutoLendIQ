import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatScore = (score: number | undefined) => {
  if (score === undefined || score === null) return "N/A";
  // Choose .toFixed(2) for precise AI scores or Math.round() for a standard look
  return score.toFixed(2);
};
