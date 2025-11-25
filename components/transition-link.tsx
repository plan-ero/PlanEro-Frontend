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
        // Wait for a short delay to allow the router to update the DOM
        // This is a common pattern to ensure the new content is ready
        await sleep(200);
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
