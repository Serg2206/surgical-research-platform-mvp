/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://proffssv.site',
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // Change frequency & priority overrides
  changefreq: 'weekly',
  priority: 0.7,

  // Transform: set higher priority for journal articles
  transform: async (config, path) => {
    // Journal articles — high priority
    if (path.startsWith('/journal/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    // Default
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },

  // Exclude admin and API routes from sitemap
  exclude: ['/admin/*', '/api/*', '/auth/*', '/dashboard/*'],

  // Robots.txt policies
  robotsTxtOptions: {
    policies: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/dashboard/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/dashboard/'],
      },
    ],
    additionalSitemaps: [],
  },
}
