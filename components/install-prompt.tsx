"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Download, Smartphone, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => setIsInstalled(true));
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstallDialog(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return {
        browser: 'Chrome',
        steps: [
          'Click the three dots menu (⋮) in the top right',
          'Select "Install Planero" or "Add to Home screen"',
          'Click "Install" in the popup'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        steps: [
          'Click the address bar',
          'Look for the install icon (📱) next to the URL',
          'Click "Install" when prompted'
        ]
      };
    } else if (userAgent.includes('safari')) {
      return {
        browser: 'Safari',
        steps: [
          'Tap the Share button (⬆️) at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" in the top right'
        ]
      };
    } else if (userAgent.includes('edg')) {
      return {
        browser: 'Edge',
        steps: [
          'Click the three dots menu (...) in the top right',
          'Select "Apps" → "Install this site as an app"',
          'Click "Install" in the popup'
        ]
      };
    }
    
    return {
      browser: 'Your Browser',
      steps: [
        'Look for an install or "Add to Home Screen" option',
        'This is usually found in the browser menu',
        'Follow the prompts to install the app'
      ]
    };
  };

  // Don't show anything if already installed
  if (isInstalled) return null;

  return (
    <>
      {/* Install Button - show only if prompt is available */}
      {deferredPrompt && (
        <Button
          onClick={handleInstallClick}
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-sm shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Install App
        </Button>
      )}

      {/* Manual Install Instructions Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Install Planero
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInstallDialog(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription>
              Install Planero as an app for quick access and a native experience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(() => {
              const { browser, steps } = getInstallInstructions();
              return (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    {browser} Instructions:
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    {steps.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })()}

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Installing the app gives you faster access, offline support, and push notifications for new venues and events.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}