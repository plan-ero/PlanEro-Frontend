"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

// Optimized motion components with CSS transforms
export const MotionDiv = motion.div;

// Common animation variants for reuse
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: "-50px" },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: "-50px" },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: "-50px" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
  viewport: { once: true, margin: "-50px" },
};

// Stagger container for children animations
export const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-50px" },
  transition: {
    staggerChildren: 0.1,
  },
};

// Optimized scroll animation hook
export function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
