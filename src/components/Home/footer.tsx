import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-[1160px] gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center">
            <Image src="/logo-full.svg" alt="Urbanify" width={109} height={32} className="h-8 w-auto" />
          </Link>
          <p className="mt-3 text-[15px] text-muted-foreground">Zeladoria urbana, do relato à solução.</p>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Cidadão</p>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li><Link href="/login" className="inline-flex min-h-11 items-center text-navy hover:underline">Reportar um problema</Link></li>
            <li><Link href="/register" className="inline-flex min-h-11 items-center text-navy hover:underline">Criar conta</Link></li>
            <li><Link href="/visit" className="inline-flex min-h-11 items-center text-navy hover:underline">Explorar a cidade</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Prefeitura</p>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li><a href="#como-funciona" className="inline-flex min-h-11 items-center text-navy hover:underline">Como funciona</a></li>
            <li><a href="mailto:contato@urbanify.com.br" className="inline-flex min-h-11 items-center text-navy hover:underline">Falar com a Urbanify</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Legal</p>
          <ul className="mt-4 space-y-3 text-[15px] text-muted-foreground">
            <li>
              Política de privacidade
              <span className="ml-2 rounded-full bg-tone-neutral-bg px-2 py-0.5 text-[13px] text-tone-neutral-fg">Em breve</span>
            </li>
            <li>
              Termos de uso
              <span className="ml-2 rounded-full bg-tone-neutral-bg px-2 py-0.5 text-[13px] text-tone-neutral-fg">Em breve</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-2 p-6 text-[13px] text-muted-foreground md:flex-row md:justify-between">
          <p>© 2026 Urbanify. Todos os direitos reservados.</p>
          <p>Mapas de demonstração: © OpenStreetMap contributors.</p>
        </div>
      </div>
    </footer>
  );
}
