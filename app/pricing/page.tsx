import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Тарифы',
  description: 'Тарифы и варианты доступа к образовательным материалам SSVproff.',
  alternates: { canonical: '/pricing' },
};

const plans = [
  {
    name: 'Базовый доступ',
    price: 'Бесплатно',
    details: 'Открытые статьи, ознакомительные материалы и часть образовательного контента.',
  },
  {
    name: 'Курс',
    price: 'Индивидуально',
    details: 'Доступ к отдельному курсу, урокам и материалам выбранной программы.',
  },
  {
    name: 'Профессиональный доступ',
    price: 'По запросу',
    details: 'Расширенный доступ для профессионального обучения, групп и образовательных организаций.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Тарифы</h1>
          <p className="mt-4 text-lg text-gray-600">
            Выберите формат доступа к материалам SSVproff. Конкретная стоимость курса отображается на странице курса.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                <p className="text-gray-600 leading-7">{plan.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/courses">Перейти к курсам</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
