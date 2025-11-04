"use client";

import { useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";

function ViewTransitionsContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Check if browser supports View Transitions API
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      console.log("View Transitions API supported");
    }
  }, [pathname]);

  return <>{children}</>;
}

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <ViewTransitionsContent>{children}</ViewTransitionsContent>
    </Suspense>
  );
}
