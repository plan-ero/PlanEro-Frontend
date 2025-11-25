"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw, Download } from "lucide-react";

export function PWAInstaller() {
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none", // Always check for updates
      });

      setSwRegistration(registration);
      console.log("[PWA] Service Worker registered:", registration);

      // Check for updates immediately
      registration.update();

      // Listen for waiting service worker (update available)
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("[PWA] New service worker available");
              setUpdateAvailable(true);
            }
          });
        }
      });

      // Check if there's already a waiting service worker
      if (registration.waiting) {
        console.log("[PWA] Service worker update already waiting");
        setUpdateAvailable(true);
      }

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[PWA] Service worker controller changed");
        window.location.reload();
      });

      // Check for updates every 30 minutes
      setInterval(
        () => {
          console.log("[PWA] Checking for service worker updates");
          registration.update();
        },
        30 * 60 * 1000,
      );
    } catch (error) {
      console.error("[PWA] Service Worker registration failed:", error);
    }
  };

  const handleUpdate = async () => {
    if (!swRegistration || !swRegistration.waiting) return;

    setIsUpdating(true);

    try {
      // Tell the waiting service worker to skip waiting
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });

      // The controllerchange event will trigger a page reload
      setTimeout(() => {
        setIsUpdating(false);
        setUpdateAvailable(false);
      }, 2000);
    } catch (error) {
      console.error("[PWA] Update failed:", error);
      setIsUpdating(false);
    }
  };

  // Update notification component
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Card className="shadow-lg border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              App Update Available
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs mb-3">
              A new version of Planero is ready. Update now for the latest
              features and improvements.
            </CardDescription>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3 mr-1" />
                    Update
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUpdateAvailable(false)}
                disabled={isUpdating}
              >
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
