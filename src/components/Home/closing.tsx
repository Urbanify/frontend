import Link from 'next/link';

import { Button } from '@/components/ui/button/button';

export function Closing() {
  return (
    <section aria-labelledby="fechamento-title" className="mx-auto mb-16 w-full max-w-[1160px] scroll-mt-24 px-6 md:mb-24">
      <div className="relative overflow-hidden rounded-[28px] bg-navy-glow p-10 text-center md:rounded-[40px] md:p-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_120%,rgba(16,255,141,.18),transparent_45%)]" />
        <h2 id="fechamento-title" className="reveal relative font-display text-display-lg text-white">
          Viu um problema? Reporte agora.
        </h2>
        <p className="reveal relative mx-auto mt-6 max-w-[560px] text-lead text-[#B9C3DD]">
          Entre com seu e-mail e acompanhe cada etapa até a solução.
        </p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-full bg-white px-6 text-base text-navy hover:bg-white/90 lg:h-[52px]">
            <Link href="/login">Reportar um problema</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full border-white/40 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white lg:h-[52px]">
            <a href="mailto:contato@urbanify.com.br">Sou da prefeitura</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
