import { ChevronDown } from 'lucide-react';

import { SectionHeading } from '@/components/Home/section-heading';

const QUESTIONS = [
  {
    q: 'Preciso criar conta para reportar?',
    a: 'Sim. Você cria a conta uma vez e depois entra com seu e-mail e um código de 6 dígitos, sem senha.',
  },
  {
    q: 'Quem verifica o problema?',
    a: 'Depende da cidade: pode ser um cidadão voluntário ou um servidor da prefeitura.',
  },
  {
    q: 'Minha cidade já usa a Urbanify?',
    a: (
      <>
        Hoje só Aracaju (SE), como cidade de demonstração. Para levar a Urbanify à sua cidade, escreva para
        {' '}
        <a href="mailto:contato@urbanify.com.br" className="font-medium text-primary underline underline-offset-4">contato@urbanify.com.br</a>
        .
      </>
    ),
  },
  {
    q: 'Existe aplicativo?',
    a: 'Ainda não. Hoje a Urbanify funciona no navegador, no celular ou no computador. O app está em breve.',
  },
];

export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="mx-auto grid w-full max-w-[1160px] scroll-mt-24 gap-12 px-6 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:py-36">
      <SectionHeading id="duvidas-title" eyebrow="Antes de começar" title="Dúvidas rápidas." />

      <div>
        {QUESTIONS.map(item => (
          <details key={item.q} className="group border-t border-border last:border-b">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold text-navy [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="max-w-[560px] pb-6 text-muted-foreground">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
