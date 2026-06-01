import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';

interface StaticInfoPageProps {
  eyebrow?: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
}

export function StaticInfoPage({ eyebrow, title, description, sections }: StaticInfoPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-2">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h1>
          <p className="mt-4 text-lg text-gray-600">{description}</p>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-7 whitespace-pre-line">{section.body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
