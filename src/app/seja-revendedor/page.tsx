import type { Metadata } from 'next';

import { Footer } from '@/components/Home/footer';
import { LandingHeader } from '@/components/Home/landing-header';
import { ResellerForm } from '@/components/Reseller/reseller-form';

export const metadata: Metadata = {
  title: 'Seja revendedor',
  description: 'Venda a zeladoria urbana da Urbanify para prefeituras da sua região. Sem taxa de inscrição.',
};

const requirements = [
  'CNPJ ativo, com atividade compatível com a revenda de software ou de serviços de tecnologia.',
  'Regularidade fiscal e trabalhista. A prefeitura pede as certidões para contratar e para pagar.',
];

export default function ResellerPage() {
  return (
    <div id="main" className="min-h-svh bg-background text-foreground">
      <LandingHeader variant="compact" />

      <div className="mx-auto grid w-full max-w-[1160px] gap-12 px-6 pb-16 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:pt-16 lg:gap-16">
        <section aria-labelledby="reseller-title" className="max-w-[52ch]">
          <p className="text-eyebrow font-semibold uppercase text-primary">Programa de revenda</p>
          <h1 id="reseller-title" className="mt-4 font-display text-display-lg text-navy">
            Seja revendedor da Urbanify
          </h1>
          <p className="mt-5 text-lead text-muted-foreground">
            Você apresenta a zeladoria urbana para prefeituras da sua região e cuida da venda. Território e meta ficam combinados por escrito antes do começo. Sem taxa de inscrição.
          </p>

          <h2 className="mt-10 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Requisitos</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-[15px] text-navy marker:text-muted-foreground">
            {requirements.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p className="mt-8 text-[15px] text-muted-foreground">
            Depois do envio, a triagem leva até 2 dias úteis, e você recebe sempre uma resposta, sim ou não.
          </p>
        </section>

        <section aria-labelledby="form-title" className="w-full max-w-[600px]">
          <h2 id="form-title" className="sr-only">Formulário de candidatura</h2>
          <ResellerForm />
        </section>
      </div>

      <Footer />
    </div>
  );
}
