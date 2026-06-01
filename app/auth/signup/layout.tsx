import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Регистрация на образовательной платформе SSVproff.',
  alternates: {
    canonical: '/auth/signup',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
