"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Smartphone,
  Shield,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAPage() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [swReady, setSwReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [checks, setChecks] = useState({
    hasServiceWorker: false,
    hasManifest: false,
    isSecureContext: false,
  });

  useEffect(() => {
    // Early exit for SSR
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    setIsMounted(true);

    try {
      // Check if PWA is supported with safe checks
      const hasServiceWorker = "serviceWorker" in navigator;
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const isSecureContext =
        window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.protocol === "https:";

      setChecks({
        hasServiceWorker,
        hasManifest,
        isSecureContext,
      });

      const isPWASupported = hasServiceWorker && hasManifest && isSecureContext;
      setIsSupported(isPWASupported);

      // Register service worker with proper error handling
      if (hasServiceWorker && navigator.serviceWorker) {
        navigator.serviceWorker
          .getRegistration()
          .then((registration) => {
            if (registration) {
              console.log(
                "[PWA] Service worker already registered:",
                registration,
              );
              setSwReady(true);
            } else {
              return navigator.serviceWorker.register("/sw.js", {
                scope: "/",
                updateViaCache: "none",
              });
            }
          })
          .then((reg) => {
            if (reg) {
              console.log("[PWA] Service worker registered:", reg);
              setSwReady(true);
            }
          })
          .catch((error) => {
            console.error("[PWA] Service worker error:", error);
            setSwReady(false);
          });
      }

      // Check if already installed with safe property access
      let isStandalone = false;
      try {
        isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      } catch (e) {
        console.warn("[PWA] matchMedia not supported:", e);
      }

      // Check iOS standalone
      if (!isStandalone && navigator && (navigator as any).standalone) {
        isStandalone = true;
      }

      // Check Android TWA
      if (!isStandalone && document.referrer) {
        try {
          isStandalone = document.referrer.includes("android-app://");
        } catch (e) {
          console.warn("[PWA] referrer check failed:", e);
        }
      }

      setIsInstalled(isStandalone);

      // Listen for install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    } catch (error) {
      console.error("[PWA] Initialization error:", error);
      setIsSupported(false);
    }
  }, []);
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.warn("[PWA] No install prompt available");
      return;
    }

    setIsInstalling(true);

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      console.log("[PWA] User response to install prompt:", outcome);

      if (outcome === "accepted") {
        console.log("[PWA] User accepted the install prompt");
        setDeferredPrompt(null);
      } else {
        console.log("[PWA] User dismissed the install prompt");
      }
    } catch (error) {
      console.error("[PWA] Install prompt failed:", error);
      // Don't clear the prompt on error, user might try again
    } finally {
      setIsInstalling(false);
    }
  };

  // Prevent SSR issues
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Install Planero App</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Install Planero App</h1>
        <p className="text-muted-foreground">
          Get the best experience with our Progressive Web App
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Install App
          </CardTitle>
          <CardDescription>
            Add Planero to your device for quick access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInstalled ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                App Already Installed!
              </h3>
              <p className="text-muted-foreground">
                Look for Planero on your home screen or app menu
              </p>
            </div>
          ) : !isSupported ? (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                PWA Not Fully Supported
              </h3>
              <p className="text-muted-foreground mb-4">
                Your browser or environment doesn't fully support Progressive
                Web Apps
              </p>
              <div className="text-left text-sm space-y-2 bg-muted p-4 rounded-lg">
                <p className="font-medium">Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    Service Worker support:{" "}
                    {checks.hasServiceWorker ? "✓" : "✗"}
                  </li>
                  <li>Manifest file: {checks.hasManifest ? "✓" : "✗"}</li>
                  <li>
                    Secure context (HTTPS/localhost):{" "}
                    {checks.isSecureContext ? "✓" : "✗"}
                  </li>
                </ul>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="text-center py-4">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                size="lg"
                className="w-full"
              >
                {isInstalling ? "Installing..." : "Install Planero App"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Install Available via Browser
              </h3>
              <p className="text-muted-foreground mb-4">
                Chrome supports PWA installation! Use the browser menu to
                install.
              </p>
              <div className="text-left text-sm space-y-3 bg-muted p-4 rounded-lg">
                <div>
                  <p className="font-medium mb-1">Chrome Desktop:</p>
                  <p className="text-muted-foreground">
                    Click the <strong>⋮</strong> menu → "Install Planero..." or
                    look for the install icon in the address bar
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Chrome Mobile:</p>
                  <p className="text-muted-foreground">
                    Tap the <strong>⋮</strong> menu → "Add to Home screen" or
                    "Install app"
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Edge:</p>
                  <p className="text-muted-foreground">
                    Click the <strong>⋯</strong> menu → "Apps" → "Install
                    Planero"
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Service Worker:</strong>{" "}
                  {swReady ? "✓ Ready" : "⏳ Loading..."}
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 border rounded-lg">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium">Native Experience</h4>
              <p className="text-sm text-muted-foreground">
                Full-screen app without browser UI
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-medium">Offline Support</h4>
              <p className="text-sm text-muted-foreground">
                Works even without internet connection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
