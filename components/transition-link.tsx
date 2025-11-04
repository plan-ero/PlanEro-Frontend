"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnchorHTMLAttributes } from "react";

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({
  href,
  children,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Check if browser supports View Transitions API
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
