"use client";

import { parseDescription } from "@/lib/parse-description";
import { useMemo } from "react";

interface ParsedDescriptionProps {
  description: string | null | undefined;
  className?: string;
}

/**
 * Component to safely render parsed descriptions as HTML
 * Handles both JSON structured data and plain text
 */
export function ParsedDescription({
  description,
  className = "",
}: ParsedDescriptionProps) {
  const parsedHtml = useMemo(() => {
    return parseDescription(description);
  }, [description]);

  if (!parsedHtml) {
    return null;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
}
