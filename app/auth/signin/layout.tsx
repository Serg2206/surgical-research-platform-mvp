import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Вход в личный кабинет SSVproff.',
  alternates: {
    canonical: '/auth/signin',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
