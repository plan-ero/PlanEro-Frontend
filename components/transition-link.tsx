"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, forwardRef } from "react";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ children, href, onClick, ...props }, ref) => {
    const router = useRouter();

    const handleTransition = async (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.preventDefault();

      // Call the original onClick handler if it exists
      if (onClick) {
        onClick(e);
      }

      // Fallback for browsers that don't support View Transitions
      if (!document.startViewTransition) {
        router.push(href);
        return;
      }

      // Start the view transition
      document.startViewTransition(async () => {
        router.push(href);

        // Wait for the URL to change to ensure the new page content is loaded
        // This prevents the transition from finishing before the new page is ready
        const currentPath = window.location.pathname;
        const targetUrl = new URL(href, window.location.href);
        const targetPath = targetUrl.pathname;

        // If navigating to the same page, just wait a bit for React to handle it
        if (currentPath === targetPath) {
          await sleep(200);
          return;
        }

        // Poll for URL change with a timeout safety
        const startTime = Date.now();
        while (window.location.pathname === currentPath && Date.now() - startTime < 2000) {
          await sleep(10);
        }

        // Small buffer to allow React to paint the new content
        await sleep(50);
      });
    };

    return (
      <Link {...props} href={href} onClick={handleTransition} ref={ref}>
        {children}
      </Link>
    );
  }
);

TransitionLink.displayName = "TransitionLink";
