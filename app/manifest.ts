import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PlanEro - Event Planning Platform',
    short_name: 'PlanEro',
    description: 'Find perfect venues, vendors, and services for your special events. From dreamy weddings to epic parties — find spaces designed to impress.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png', 
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-desktop-1.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Home page showing featured venues and categories'
      },
      {
        src: '/screenshot-desktop-2.png', 
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Browse venues with advanced filters'
      },
      {
        src: '/screenshot-mobile-1.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile home screen with venue categories'
      },
      {
        src: '/screenshot-mobile-2.png',
        sizes: '390x844', 
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile venue details with booking options'
      },
    ],
    categories: ['lifestyle', 'social', 'productivity', 'business'],
    shortcuts: [
      {
        name: 'Find Venues',
        short_name: 'Venues',
        description: 'Browse and search event venues',
        url: '/venues',
        icons: [{ src: '/venue-icon.png', sizes: '96x96' }],
      },
      {
        name: 'Find Vendors',
        short_name: 'Vendors',
        description: 'Discover event vendors and services',
        url: '/vendors',
        icons: [{ src: '/vendor-icon.png', sizes: '96x96' }],
      },
      {
        name: 'My Favorites',
        short_name: 'Favorites',
        description: 'View saved venues and vendors',
        url: '/favorites',
        icons: [{ src: '/heart-icon.png', sizes: '96x96' }],
      },
    ],
    orientation: 'portrait-primary',
    scope: '/',
    id: 'planero-pwa',
    launch_handler: {
      client_mode: 'focus-existing'
    },
    related_applications: [],
    prefer_related_applications: false,
  }
}