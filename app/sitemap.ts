import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getAllJournalArticles } from '@/lib/journal';
import { resolveCourseSlug } from '@/lib/slugs';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://proffssv.site';

function page(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    page('', 1, 'daily'),
    page('/courses', 0.9, 'daily'),
    page('/articles', 0.8, 'daily'),
    page('/journal', 0.8, 'weekly'),
    page('/about', 0.7),
    page('/pricing', 0.7),
    page('/contact', 0.6),
    page('/privacy', 0.3, 'yearly'),
    page('/terms', 0.3, 'yearly'),
    page('/refund-policy', 0.3, 'yearly'),
    page('/medical-disclaimer', 0.3, 'yearly'),
  ];

  try {
    const [courses, articles] = await Promise.all([
      prisma.course.findMany({
        where: { published: true },
        select: { slug: true, title: true, updatedAt: true, createdAt: true },
      }),
      prisma.article.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, publishedAt: true, createdAt: true },
      }),
    ]);

    const coursePages = courses.map((course) => ({
      url: `${siteUrl}/courses/${resolveCourseSlug(course)}`,
      lastModified: course.updatedAt || course.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    const articlePages = articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt || article.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    const journalPages = getAllJournalArticles().map((article) => ({
      url: `${siteUrl}/journal/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...coursePages, ...articlePages, ...journalPages];
  } catch (error) {
    console.error('Failed to build dynamic sitemap entries:', error);
    return staticPages;
  }
}
