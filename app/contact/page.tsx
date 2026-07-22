import type { Metadata } from 'next';
import { StaticInfoPage } from '@/components/pages/static-info-page';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@ssvnauka.com';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контакты образовательной платформы SSVproff.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <StaticInfoPage
      eyebrow="Связь"
      title="Контакты"
      description="Вопросы по доступу, курсам, публикациям и сотрудничеству можно направить администрации платформы."
      sections={[
        {
          title: 'Email',
          body: contactEmail,
        },
        {
          title: 'Темы обращений',
          body: 'Доступ к курсам, ошибки в материалах, предложения по сотрудничеству, вопросы по публикациям и технические проблемы на сайте.',
        },
        {
          title: 'Ответственность',
          body: 'Не отправляйте через форму или email персональные медицинские данные пациентов. Платформа не предназначена для экстренной связи или индивидуальных медицинских консультаций.',
        },
      ]}
    />
  );
}
