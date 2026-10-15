import type { Metadata } from 'next';

import { LegalPage } from '@/components/Legal/legal-page';
import { termsOfUse } from '@/components/Legal/terms-content';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'As regras para usar a plataforma Urbanify, a relação com a prefeitura e as suas responsabilidades.',
};

export default function TermsPage() {
  return <LegalPage legal={termsOfUse} />;
}
