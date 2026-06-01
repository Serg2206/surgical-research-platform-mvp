
import { PrismaClient, UserRole, Difficulty } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'gastroenterology' },
      update: {},
      create: {
        name: 'Гастроэнтерология',
        slug: 'gastroenterology',
        description: 'Хирургия желудочно-кишечного тракта',
        color: '#10B981',
        icon: '🫀'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'oncology' },
      update: {},
      create: {
        name: 'Онкохирургия',
        slug: 'oncology',
        description: 'Хирургическое лечение онкологических заболеваний',
        color: '#F59E0B',
        icon: '🔬'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'general-surgery' },
      update: {},
      create: {
        name: 'Общая хирургия',
        slug: 'general-surgery',
        description: 'Основы хирургических вмешательств',
        color: '#3B82F6',
        icon: '⚕️'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'emergency-surgery' },
      update: {},
      create: {
        name: 'Экстренная хирургия',
        slug: 'emergency-surgery',
        description: 'Неотложные хирургические вмешательства',
        color: '#EF4444',
        icon: '🚨'
      }
    })
  ])

  console.log('📁 Categories created')

  // Create admin user (Professor Sushkov)
  const adminUser = await prisma.user.upsert({
    where: { email: 'prof.sushkov@surgical-platform.com' },
    update: {},
    create: {
      email: 'prof.sushkov@surgical-platform.com',
      password: await bcrypt.hash('admin123', 12),
      fullName: 'Профессор Сергей Валентинович Сушков',
      name: 'Проф. С.В. Сушков',
      role: UserRole.ADMIN,
      specialization: 'Хирургия, Гастроэнтерология',
      institution: 'Медицинский университет',
      bio: 'Профессор хирургии с 40-летним опытом, специалист в области гастроэнтерологии и минимально инвазивной хирургии.'
    }
  })

  // Create test user (required for testing)
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: await bcrypt.hash('johndoe123', 12),
      fullName: 'John Doe',
      name: 'John Doe',
      role: UserRole.ADMIN
    }
  })

  // Create teacher users
  const teachers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'teacher1@surgical-platform.com' },
      update: {},
      create: {
        email: 'teacher1@surgical-platform.com',
        password: await bcrypt.hash('teacher123', 12),
        fullName: 'Доктор Анна Петрова',
        name: 'Д-р А. Петрова',
        role: UserRole.TEACHER,
        specialization: 'Онкохирургия',
        institution: 'Медицинский центр'
      }
    }),
    prisma.user.upsert({
      where: { email: 'teacher2@surgical-platform.com' },
      update: {},
      create: {
        email: 'teacher2@surgical-platform.com',
        password: await bcrypt.hash('teacher123', 12),
        fullName: 'Доктор Михаил Иванов',
        name: 'Д-р М. Иванов',
        role: UserRole.TEACHER,
        specialization: 'Экстренная хирургия',
        institution: 'Городская больница'
      }
    })
  ])

  // Create student users
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@surgical-platform.com' },
      update: {},
      create: {
        email: 'student1@surgical-platform.com',
        password: await bcrypt.hash('student123', 12),
        fullName: 'Елена Смирнова',
        name: 'Елена Смирнова',
        role: UserRole.STUDENT,
        specialization: 'Студент 5 курса',
        institution: 'Медицинский университет'
      }
    }),
    prisma.user.upsert({
      where: { email: 'student2@surgical-platform.com' },
      update: {},
      create: {
        email: 'student2@surgical-platform.com',
        password: await bcrypt.hash('student123', 12),
        fullName: 'Алексей Козлов',
        name: 'Алексей Козлов',
        role: UserRole.STUDENT,
        specialization: 'Ординатор 1 года',
        institution: 'Медицинский центр'
      }
    })
  ])

  console.log('👥 Users created')

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'laparoscopy' },
      update: {},
      create: { name: 'Лапароскопия', slug: 'laparoscopy', color: '#3B82F6' }
    }),
    prisma.tag.upsert({
      where: { slug: 'minimally-invasive' },
      update: {},
      create: { name: 'Малоинвазивная хирургия', slug: 'minimally-invasive', color: '#10B981' }
    }),
    prisma.tag.upsert({
      where: { slug: 'emergency' },
      update: {},
      create: { name: 'Экстренная помощь', slug: 'emergency', color: '#EF4444' }
    }),
    prisma.tag.upsert({
      where: { slug: 'robotic-surgery' },
      update: {},
      create: { name: 'Робот-ассистированная хирургия', slug: 'robotic-surgery', color: '#8B5CF6' }
    })
  ])

  console.log('🏷️ Tags created')

  // Create courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'Основы лапароскопической холецистэктомии',
        slug: 'laparoscopic-cholecystectomy-basics',
        description: 'Полный курс по технике выполнения лапароскопической холецистэктомии, включая показания, противопоказания, технические особенности и возможные осложнения.',
        shortDescription: 'Изучите технику безопасной лапароскопической холецистэктомии',
        difficulty: Difficulty.INTERMEDIATE,
        duration: 8,
        published: true,
        featured: true,
        authorId: adminUser.id,
        categoryId: categories[0].id,
        prerequisites: 'Базовые знания анатомии и общей хирургии',
        learningObjectives: [
          'Освоить технику лапароскопической холецистэктомии',
          'Изучить анатомические ориентиры',
          'Научиться предотвращать осложнения'
        ],
        lessons: {
          create: [
            {
              title: 'Анатомия желчного пузыря и желчевыводящих путей',
              slug: 'gallbladder-anatomy',
              description: 'Детальное изучение анатомии для безопасной операции',
              content: 'В этом уроке мы подробно рассмотрим анатомию желчного пузыря...',
              order: 1,
              duration: 45
            },
            {
              title: 'Показания и противопоказания к лапароскопической холецистэктомии',
              slug: 'indications-contraindications',
              description: 'Критерии отбора пациентов для лапароскопического доступа',
              content: 'Показания к лапароскопической холецистэктомии включают...',
              order: 2,
              duration: 30
            },
            {
              title: 'Техника операции: пошаговое руководство',
              slug: 'surgical-technique',
              description: 'Детальное описание всех этапов операции',
              content: 'Операция начинается с создания пневмоперитонеума...',
              order: 3,
              duration: 90
            },
            {
              title: 'Осложнения и их профилактика',
              slug: 'complications-prevention',
              description: 'Возможные осложнения и способы их предотвращения',
              content: 'Основные осложнения лапароскопической холецистэктомии...',
              order: 4,
              duration: 60
            }
          ]
        }
      }
    }),

    prisma.course.create({
      data: {
        title: 'Неотложная абдоминальная хирургия: от молекулы до решения',
        slug: 'neotlozhnaya-abdominalnaya-hirurgiya-ot-molekuly-do-resheniya',
        description: 'Авторский курс по диагностике, молекулярной логике шока и тактике решений в неотложной абдоминальной хирургии.',
        shortDescription: 'От клеточной биологии шока до Damage Control Surgery 2.0',
        difficulty: Difficulty.ADVANCED,
        duration: 16,
        published: true,
        featured: true,
        authorId: teachers[1].id,
        categoryId: categories[3].id,
        prerequisites: 'Опыт работы в хирургии не менее 2 лет',
        learningObjectives: [
          'Быстрая диагностика острого живота',
          'Выбор оптимальной тактики лечения',
          'Освоение экстренных операций'
        ],
        lessons: {
          create: [
            {
              title: 'Синдром острого живота: дифференциальная диагностика',
              slug: 'acute-abdomen-diagnosis',
              description: 'Алгоритм диагностики при остром животе',
              content: 'Острый живот - собирательное понятие...',
              order: 1,
              duration: 60
            },
            {
              title: 'Острый аппендицит: диагностика и лечение',
              slug: 'acute-appendicitis',
              description: 'Современные подходы к лечению аппендицита',
              content: 'Острый аппендицит остается одним из самых частых...',
              order: 2,
              duration: 45
            },
            {
              title: 'Перфоративная язва: экстренная тактика',
              slug: 'perforated-ulcer',
              description: 'Диагностика и хирургическое лечение перфоративной язвы',
              content: 'Перфорация язвы требует немедленного вмешательства...',
              order: 3,
              duration: 75
            }
          ]
        }
      }
    }),

    prisma.course.create({
      data: {
        title: 'Онкохирургия желудочно-кишечного тракта',
        slug: 'gi-oncosurgery',
        description: 'Специализированный курс по хирургическому лечению злокачественных новообразований ЖКТ.',
        shortDescription: 'Хирургическое лечение онкологических заболеваний ЖКТ',
        difficulty: Difficulty.EXPERT,
        duration: 16,
        published: true,
        authorId: teachers[0].id,
        categoryId: categories[1].id,
        prerequisites: 'Сертификат онколога или хирурга',
        learningObjectives: [
          'Принципы радикальной онкохирургии',
          'Современные реконструктивные методики',
          'Мультидисциплинарный подход'
        ],
        lessons: {
          create: [
            {
              title: 'Принципы онкологической хирургии',
              slug: 'oncological-principles',
              description: 'Основные принципы радикального лечения',
              content: 'Онкологическая хирургия требует соблюдения определенных принципов...',
              order: 1,
              duration: 90
            },
            {
              title: 'Рак желудка: хирургическое лечение',
              slug: 'gastric-cancer-surgery',
              description: 'Техника гастрэктомии и резекции желудка',
              content: 'Хирургическое лечение рака желудка включает...',
              order: 2,
              duration: 120
            }
          ]
        }
      }
    })
  ])

  console.log('📚 Courses created')

  // Create course tags
  await Promise.all([
    prisma.courseTag.create({
      data: { courseId: courses[0].id, tagId: tags[0].id }
    }),
    prisma.courseTag.create({
      data: { courseId: courses[0].id, tagId: tags[1].id }
    }),
    prisma.courseTag.create({
      data: { courseId: courses[1].id, tagId: tags[2].id }
    }),
    prisma.courseTag.create({
      data: { courseId: courses[2].id, tagId: tags[3].id }
    })
  ])

  // Create articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Робот-ассистированная хирургия: настоящее и будущее',
        slug: 'robotic-surgery-present-future',
        content: `
# Робот-ассистированная хирургия: настоящее и будущее

Робот-ассистированная хирургия представляет собой революционный подход в современной медицине, 
который значительно расширяет возможности хирургов и улучшает результаты лечения пациентов.

## Преимущества робот-ассистированной хирургии

1. **Высокая точность движений** - роботические системы обеспечивают точность до миллиметра
2. **Трехмерная визуализация** - хирург получает детальное изображение операционного поля
3. **Устранение тремора** - система фильтрует естественные колебания рук хирурга
4. **Минимальная инвазивность** - значительно меньшие разрезы по сравнению с открытой хирургией

## Применение в различных областях

### Урология
- Радикальная простатэктомия
- Резекция почки
- Реконструктивные операции на мочевыводящих путях

### Гинекология
- Гистерэктомия
- Миомэктомия
- Лечение эндометриоза

### Общая хирургия
- Холецистэктомия
- Резекции кишечника
- Антирефлюксные операции

## Будущее робот-ассистированной хирургии

Развитие технологий искусственного интеллекта и машинного обучения открывает новые горизонты:

- Автономные хирургические системы
- Интеграция с системами навигации
- Дистанционная хирургия (телехирургия)
- Персонализированные хирургические планы на основе ИИ

## Заключение

Робот-ассистированная хирургия продолжает эволюционировать, предлагая хирургам новые инструменты 
для более точного и безопасного лечения пациентов. Важно отметить, что технология не заменяет 
хирурга, а расширяет его возможности и повышает качество медицинской помощи.
        `,
        excerpt: 'Обзор современных достижений и перспектив развития робот-ассистированной хирургии',
        published: true,
        featured: true,
        readTime: 8,
        authorId: adminUser.id,
        categoryId: categories[2].id,
        publishedAt: new Date()
      }
    }),

    prisma.article.create({
      data: {
        title: 'Минимально инвазивная хирургия в лечении грыж',
        slug: 'minimally-invasive-hernia-surgery',
        content: `
# Минимально инвазивная хирургия в лечении грыж

Минимально инвазивная хирургия произвела революцию в лечении грыж передней брюшной стенки, 
предлагая пациентам менее болезненные процедуры с быстрым восстановлением.

## Типы грыж, поддающихся минимально инвазивному лечению

### Паховые грыжи
- TEP (Total Extraperitoneal) операция
- TAPP (Trans Abdominal Pre Peritoneal) операция

### Вентральные грыжи
- Лапароскопическая пластика с сеткой
- Роботическая герниопластика

## Преимущества лапароскопического подхода

1. **Уменьшение болевого синдрома**
2. **Быстрое восстановление**
3. **Минимальные рубцы**
4. **Низкий риск раневых осложнений**
5. **Возможность лечения двусторонних грыж одномоментно**

## Показания и противопоказания

### Показания:
- Рецидивные грыжи после открытых операций
- Двусторонние паховые грыжи
- Грыжи у спортсменов

### Противопоказания:
- Тяжелые спайки брюшной полости
- Коагулопатии
- Беременность

## Техника операции

Операция выполняется под общим наркозом с использованием CO2 для создания рабочего пространства. 
Размещение портов должно обеспечивать оптимальную визуализацию и удобство работы инструментами.

## Послеоперационный период

Большинство пациентов могут быть выписаны в день операции или на следующий день. 
Возвращение к обычной активности происходит значительно быстрее по сравнению с открытой хирургией.
        `,
        excerpt: 'Современные методы минимально инвазивного лечения грыж передней брюшной стенки',
        published: true,
        featured: false,
        readTime: 6,
        authorId: teachers[0].id,
        categoryId: categories[2].id,
        publishedAt: new Date()
      }
    })
  ])

  console.log('📄 Articles created')

  // Create enrollments and progress
  const enrollments = await Promise.all([
    prisma.enrollment.create({
      data: {
        userId: students[0].id,
        courseId: courses[0].id,
        progress: 75
      }
    }),
    prisma.enrollment.create({
      data: {
        userId: students[0].id,
        courseId: courses[1].id,
        progress: 25
      }
    }),
    prisma.enrollment.create({
      data: {
        userId: students[1].id,
        courseId: courses[0].id,
        progress: 100,
        completedAt: new Date()
      }
    })
  ])

  // Create progress records
  const courseWithLessons = await prisma.course.findFirst({
    where: { id: courses[0].id },
    include: { lessons: true }
  })

  if (courseWithLessons) {
    await prisma.progress.create({
      data: {
        userId: students[0].id,
        courseId: courseWithLessons.id,
        completedLessons: 3,
        totalLessons: courseWithLessons.lessons.length,
        progressPercentage: 75,
        lessonProgress: {
          create: courseWithLessons.lessons.slice(0, 3).map((lesson, index) => ({
            lessonId: lesson.id,
            completed: true,
            timeSpent: 1800 + index * 600, // 30-40 minutes per lesson
            completedAt: new Date(Date.now() - (3 - index) * 24 * 60 * 60 * 1000)
          }))
        }
      }
    })
  }

  console.log('📊 Progress records created')

  // Create some sample FHIR resources
  await Promise.all([
    prisma.fHIRResource.create({
      data: {
        resourceType: 'Patient',
        fhirId: 'patient-demo-001',
        data: {
          resourceType: "Patient",
          id: "patient-demo-001",
          name: [
            {
              use: "official",
              family: "Петров",
              given: ["Николай", "Александрович"]
            }
          ],
          gender: "male",
          birthDate: "1975-03-20",
          address: [
            {
              use: "home",
              line: ["ул. Московская, 45"],
              city: "Санкт-Петербург",
              postalCode: "190000",
              country: "RU"
            }
          ]
        },
        status: 'active',
        authorId: adminUser.id
      }
    }),

    prisma.fHIRResource.create({
      data: {
        resourceType: 'Procedure',
        fhirId: 'procedure-demo-001',
        data: {
          resourceType: "Procedure",
          id: "procedure-demo-001",
          status: "completed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "80146002",
                display: "Appendectomy"
              }
            ],
            text: "Лапароскопическая аппендэктомия"
          },
          subject: {
            reference: "Patient/patient-demo-001",
            display: "Петров Николай Александрович"
          },
          performedDateTime: "2024-01-20T14:30:00Z",
          performer: [
            {
              actor: {
                reference: "Practitioner/prof-sushkov",
                display: "Проф. Сергей Валентинович Сушков"
              }
            }
          ]
        },
        status: 'completed',
        authorId: adminUser.id
      }
    })
  ])

  console.log('🏥 FHIR resources created')

  console.log('✅ Database seeded successfully!')
  console.log('\n📧 Test accounts:')
  console.log('Admin: prof.sushkov@surgical-platform.com / admin123')
  console.log('Teacher: teacher1@surgical-platform.com / teacher123')
  console.log('Student: student1@surgical-platform.com / student123')
  console.log('Test: john@doe.com / johndoe123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
