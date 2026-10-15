import type { Metadata } from 'next';

import { LegalPage } from '@/components/Legal/legal-page';
import { privacyPolicy } from '@/components/Legal/privacy-content';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Urbanify trata os seus dados pessoais, conforme a LGPD, e quais são os seus direitos.',
};

export default function PrivacyPage() {
  return <LegalPage legal={privacyPolicy} />;
}
