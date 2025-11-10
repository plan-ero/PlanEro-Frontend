"use client";

import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    // Check if mobile device (disable animations on mobile for performance)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    
    if (isMobile) {
      setShouldReduceMotion(true);
    }

    const handleChange = () => {
      setShouldReduceMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return shouldReduceMotion;
}

// Helper to conditionally apply motion props - returns props that make element visible immediately
export function getMotionProps(shouldReduceMotion: boolean, animationProps: any) {
  if (shouldReduceMotion) {
    // Return props that make the element immediately visible without animation
    return {
      initial: false,
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0 },
    };
  }
  return animationProps;
}
