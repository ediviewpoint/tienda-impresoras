import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/checkout', '/cuenta'],
      },
    ],
    sitemap: 'https://printmax.mx/sitemap.xml',
  }
}
