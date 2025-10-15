"use client";

import React, { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import SelectRoleContent from "./select-role-content";

export default function SelectAccountType() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <SelectRoleContent />
    </Suspense>
  );
}
