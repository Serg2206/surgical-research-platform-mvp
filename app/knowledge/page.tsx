import { Metadata } from 'next';
import ClientKnowledge from '@/components/pages/client-knowledge';

export const metadata: Metadata = {
  title: 'База знаний — Неотложная абдоминальная хирургия',
  description: 'Интерактивная база знаний по неотложной абдоминальной хирургии',
};

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientKnowledge />
    </div>
  );
}
