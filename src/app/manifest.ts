import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Suksan Massage',
    short_name: 'Suksan',
    description: 'Traditionelle Thai Massage in Zürich',
    start_url: '/',
    display: 'standalone',
    background_color: '#051405',
    theme_color: '#248f24',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
