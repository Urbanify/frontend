import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button/button';

type LandingHeaderProps = {
  variant?: 'home' | 'compact';
};

export function LandingHeader({ variant = 'home' }: LandingHeaderProps) {
  const compact = variant === 'compact';
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-navy focus:shadow-float"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md md:h-20">
        <div className={`mx-auto flex size-full items-center justify-between gap-4 px-6 ${compact ? 'max-w-screen-xl' : 'max-w-[1160px]'}`}>
          <Link href="/" className="flex min-h-11 items-center">
            <Image src="/logo-full.svg" alt="Urbanify" width={109} height={32} className="h-7 w-auto md:h-8" priority />
          </Link>

          {!compact && (
            <nav aria-label="Principal" className="hidden items-center gap-8 text-[15px] text-muted-foreground md:flex">
              <a href="#como-funciona" className="inline-flex min-h-11 items-center hover:text-navy">Como funciona</a>
              <a href="#prefeitura" className="inline-flex min-h-11 items-center hover:text-navy">Para a prefeitura</a>
              <Link href="/visit" className="inline-flex min-h-11 items-center hover:text-navy">Explorar a cidade</Link>
            </nav>
          )}

          <div className="flex items-center gap-2 md:gap-6">
            {compact
              ? (
                  <Link href="/" className="hidden min-h-11 items-center text-[15px] text-muted-foreground hover:text-navy md:flex">
                    Voltar ao início
                  </Link>
                )
              : (
                  <Link href="/login" className="hidden min-h-11 items-center text-[15px] text-muted-foreground hover:text-navy md:flex">
                    Entrar
                  </Link>
                )}
            <Button asChild className="h-11 rounded-full px-5 md:h-10">
              <Link href="/login">Reportar um problema</Link>
            </Button>
          </div>
        </div>
        <div className="scroll-progress" aria-hidden="true" />
      </header>
    </>
  );
}
