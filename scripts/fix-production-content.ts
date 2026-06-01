import { PrismaClient } from '@prisma/client';
import { slugifyText } from '../lib/slugs';

const prisma = new PrismaClient();

const targetCourseTitle = 'Неотложная абдоминальная хирургия: от молекулы до решения';
const targetCourseSlug = 'neotlozhnaya-abdominalnaya-hirurgiya-ot-molekuly-do-resheniya';

async function getUniqueCourseSlug(courseId: string, baseSlug: string): Promise<string> {
  const normalizedBase = baseSlug || `course-${courseId}`;
  let candidate = normalizedBase;
  let suffix = 2;

  while (true) {
    const existing = await prisma.course.findFirst({
      where: {
        slug: candidate,
        NOT: { id: courseId },
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${normalizedBase}-${suffix}`;
    suffix += 1;
  }
}

async function main() {
  const targetCourse = await prisma.course.findFirst({
    where: {
      title: targetCourseTitle,
    },
  });

  if (targetCourse) {
    const safeSlug = await getUniqueCourseSlug(targetCourse.id, targetCourseSlug);

    await prisma.course.update({
      where: { id: targetCourse.id },
      data: {
        slug: safeSlug,
        published: true,
      },
    });

    console.log(`Fixed course slug: ${targetCourse.id} -> ${safeSlug}`);
  } else {
    console.log('Target course title was not found.');
  }

  const emptySlugCourses = await prisma.course.findMany({
    where: { slug: '' },
    select: { id: true, title: true },
  });

  for (const course of emptySlugCourses) {
    const slug = await getUniqueCourseSlug(course.id, slugifyText(course.title));
    if (!slug) continue;

    await prisma.course.update({
      where: { id: course.id },
      data: { slug },
    });

    console.log(`Fixed empty course slug: ${course.id} -> ${slug}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
