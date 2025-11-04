import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Price enum values from backend
export enum PriceEnum {
  INEXPENSIVE = "INEXPENSIVE",
  AFFORDABLE = "AFFORDABLE",
  MODERATE = "MODERATE",
  LUXURY = "LUXURY",
}

// Global price display utility function
export function getPriceDisplay(priceEnum: PriceEnum | string): string {
  const enumValue = typeof priceEnum === "string" ? priceEnum : priceEnum;

  switch (enumValue) {
    case PriceEnum.INEXPENSIVE:
      return "₹5,000 - ₹15,000";
    case PriceEnum.AFFORDABLE:
      return "₹15,000 - ₹35,000";
    case PriceEnum.MODERATE:
      return "₹35,000 - ₹75,000";
    case PriceEnum.LUXURY:
      return "₹75,000+";
    default:
      return "Price on request";
  }
}
