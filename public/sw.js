// Progressive Web App Service Worker - Enhanced Version
// Optimized for Next.js 16 with modern PWA features

const CACHE_NAME = "planero-pwa-v2.0";
const STATIC_CACHE = "planero-static-v2.0";
const DYNAMIC_CACHE = "planero-dynamic-v2.0";
const IMAGE_CACHE = "planero-images-v2.0";

// Critical resources to cache immediately
const STATIC_URLS = [
  "/",
  "/venues",
  "/vendors",
  "/services",
  "/search",
  "/about",
  "/pwa",
  "/manifest.json",
  "/placeholder-logo.png",
];

// Runtime caching strategies
const CACHE_STRATEGIES = {
  // Static assets - cache first
  static: ["/_next/static/", "/static/", "/images/", "/icons/"],
  // API routes - network first
  api: ["/api/"],
  // Images - cache first with fallback
  images: [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"],
};

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("[SW] Caching static resources");
        return cache.addAll(STATIC_URLS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ]),
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              !cacheName.startsWith("planero-") ||
              cacheName.includes("v1") ||
              (!cacheName.includes("v2.0") && cacheName.startsWith("planero-"))
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),
      // Claim all clients
      self.clients.claim(),
    ]),
  );
});

// Enhanced fetch handler with multiple caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(url.pathname)) {
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(url.pathname)) {
    event.respondWith(handleImageRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Check if request is for static asset
function isStaticAsset(pathname) {
  return CACHE_STRATEGIES.static.some((pattern) => pathname.includes(pattern));
}

// Check if request is for API
function isApiRequest(pathname) {
  return CACHE_STRATEGIES.api.some((pattern) => pathname.includes(pattern));
}

// Check if request is for image
function isImageRequest(pathname) {
  return CACHE_STRATEGIES.images.some((ext) =>
    pathname.toLowerCase().includes(ext),
  );
}

// Check if request is navigation
function isNavigationRequest(request) {
  return request.mode === "navigate";
}

// Cache first strategy for static assets
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("[SW] Static asset error:", error);
    return new Response("Asset not available", { status: 503 });
  }
}

// Network first strategy for API requests
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);

    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log("[SW] API network failed, trying cache");
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    return new Response(JSON.stringify({ error: "Network unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Cache first with network fallback for images
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return placeholder image for failed image requests
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af">Image unavailable</text></svg>',
      { headers: { "Content-Type": "image/svg+xml" } },
    );
  }
}

// Navigation requests - cache with network fallback
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);

    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log("[SW] Navigation network failed, trying cache");
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return offline page
    const offlineCache = await caches.open(STATIC_CACHE);
    return offlineCache.match("/") || new Response("Offline", { status: 503 });
  }
}

// Generic request handler
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    return (
      cache.match(request) ||
      new Response("Resource not available", { status: 503 })
    );
  }
}

// Push notification event handler
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: "/badge-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
      actions: [
        {
          action: "explore",
          title: "View Details",
          icon: "/action-icon.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/close-icon.png",
        },
      ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click event handler
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/venues"));
  } else if (event.action === "close") {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Background sync triggered");
    // Handle background sync operations
  }
});

// Handle app updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
