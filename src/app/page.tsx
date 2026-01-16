import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button/button';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

const flowSteps = [
  {
    title: 'Registro inteligente',
    description:
      'Moradores reportam problemas com localização, fotos e descrição clara.',
  },
  {
    title: 'Validação responsável',
    description:
      'Um fiscal confirma a ocorrência e garante que a demanda é real.',
  },
  {
    title: 'Gestão com responsabilidade',
    description:
      'Um gestor acompanha, resolve e fecha o ciclo com transparência.',
  },
];

const highlightCards = [
  {
    title: 'Painel de ocorrências',
    description: 'Priorize por urgência, status e localização em segundos.',
  },
  {
    title: 'Fluxo com trilha',
    description: 'Histórico completo com decisões registradas.',
  },
  {
    title: 'Visão por cidade',
    description: 'Gestores veem o que importa para cada região.',
  },
  {
    title: 'Dados para decisão',
    description: 'Relatórios consolidados, exportações e indicadores urbanos.',
  },
  {
    title: 'Serviços ao cidadão',
    description: 'Coleta de lixo, UBSs e informações públicas organizadas.',
  },
  {
    title: 'Turismo e visitante',
    description: 'Acesso público a pontos turísticos e atrativos locais.',
  },
];

const mapPins = [
  { name: 'Centro', status: 'Resolvido', position: 'left-16 top-12' },
  { name: 'Zona Norte', status: 'Em validação', position: 'right-16 top-20' },
  { name: 'Zona Sul', status: 'Em gestão', position: 'left-1/3 bottom-20' },
  { name: 'Leste', status: 'Reportado', position: 'right-24 bottom-14' },
];

const scopeScenes = [
  {
    tag: 'Gestão urbana e inteligência',
    title: 'Um centro de comando que transforma dados em ação.',
    description:
      'Dashboard geral, relatórios consolidados, exportações rápidas e leitura por mapas ou listas. Tudo conectado para acelerar a decisão.',
    highlight: ['Dashboard vivo', 'Relatórios e exportações', 'Mapas + listas'],
    accent: 'from-primary/20 via-transparent to-transparent',
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Centro urbano</span>
          <span className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary">
            Exportar
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Indicadores da cidade</p>
            <p className="mt-2 text-2xl font-semibold">+18%</p>
            <div className="mt-3 h-2 w-full rounded-full bg-primary/20" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Alertas ativos</p>
            <p className="mt-2 text-2xl font-semibold">24</p>
            <div className="mt-3 flex gap-1">
              <span className="h-2 w-1/2 rounded-full bg-accent/40" />
              <span className="h-2 w-1/3 rounded-full bg-secondary/70" />
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-border/60 bg-card/90 p-3">
          <p className="text-xs text-muted-foreground">Leitura por mapa e lista</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-xs font-semibold">Centro</span>
            <span className="text-[10px] text-muted-foreground">Resolvido</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold">Zona Sul</span>
            <span className="text-[10px] text-muted-foreground">Em gestão</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Problemas urbanos + obras',
    title: 'Registro, validação e obras com transparência total.',
    description:
      'Do primeiro relato ao fechamento, tudo fica rastreável. Obras e infraestrutura acompanham prazos, custos e histórico público.',
    highlight: ['Registro com evidências', 'Validação responsável', 'Obras acompanhadas'],
    accent: 'from-accent/30 via-transparent to-transparent',
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Ciclo de resolução</span>
          <span className="rounded-full bg-accent/30 px-2 py-1 text-[10px] font-semibold text-accent-foreground">
            Em andamento
          </span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Reportado</p>
            <p className="mt-1 text-sm font-semibold">Iluminação sem energia</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Fiscal confirmou</p>
            <p className="mt-1 text-sm font-semibold">Equipe acionada</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Obra vinculada</p>
            <p className="mt-1 text-sm font-semibold">Reparo programado</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="rounded-lg border border-border/60 bg-card/90 p-2 text-center">
            <p className="text-sm font-semibold text-foreground">32</p>
            <p>Obras</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/90 p-2 text-center">
            <p className="text-sm font-semibold text-foreground">18</p>
            <p>Equipes</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/90 p-2 text-center">
            <p className="text-sm font-semibold text-foreground">96%</p>
            <p>Prazo</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Criminalidade + saúde + serviços',
    title: 'Segurança e cuidado com visão territorial.',
    description:
      'Dados de criminalidade, UBSs, hospitais e horários de serviços públicos reunidos em uma visão simples para orientar a ação.',
    highlight: ['Análise por regiões', 'UBSs e hospitais', 'Coleta por bairro'],
    accent: 'from-secondary/60 via-transparent to-transparent',
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Saúde e segurança</span>
          <span className="rounded-full bg-secondary/80 px-2 py-1 text-[10px] font-semibold text-secondary-foreground">
            Mapa vivo
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Risco territorial</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="h-6 rounded-lg bg-primary/15" />
              <div className="h-6 rounded-lg bg-accent/30" />
              <div className="h-6 rounded-lg bg-secondary/70" />
              <div className="h-6 rounded-lg bg-accent/20" />
              <div className="h-6 rounded-lg bg-primary/25" />
              <div className="h-6 rounded-lg bg-secondary/60" />
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">UBS mais próxima</p>
            <p className="mt-2 text-sm font-semibold">UBS Central</p>
            <p className="text-xs text-muted-foreground">08h - 18h</p>
            <div className="mt-3 rounded-lg bg-muted/40 px-2 py-1 text-[10px] text-muted-foreground">
              Coleta: Qui, 07h
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Comunicação, participação e turismo',
    title: 'A cidade conversa, engaja e valoriza seu território.',
    description:
      'Comunicados oficiais, comentários e modo visitante para promover turismo, atrativos e experiências locais com acesso público.',
    highlight: ['Notícias oficiais', 'Comentários e feedback', 'Turismo sem login'],
    accent: 'from-primary/20 via-transparent to-transparent',
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Vitrine da cidade</span>
          <span className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary">
            Público
          </span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Comunicado oficial</p>
            <p className="mt-1 text-sm font-semibold">Nova rota de ônibus aprovada</p>
            <p className="text-xs text-muted-foreground">Publicação com anexos e agenda</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Participação cidadã</p>
            <p className="mt-1 text-sm font-semibold">412 comentários ativos</p>
            <p className="text-xs text-muted-foreground">Feedbacks priorizados</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/90 p-3">
            <p className="text-xs text-muted-foreground">Modo visitante</p>
            <p className="mt-1 text-sm font-semibold">Praias, passeios e atrativos</p>
            <p className="text-xs text-muted-foreground">Acesso sem login</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function HomePage() {
  return (
    <main className={`${spaceGrotesk.className} min-h-svh bg-background text-foreground`}>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-20 size-[520px] rounded-full bg-accent/30 blur-[140px]" />
        <div className="pointer-events-none absolute left-1/2 top-[480px] size-[420px] -translate-x-1/2 rounded-full bg-secondary/50 blur-[160px]" />

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-card shadow-sm">
              <Image src="/logo.svg" alt="Urbanify" width={30} height={30} />
            </div>
            <span className="text-lg font-semibold">Urbanify</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#fluxos" className="hover:text-foreground">Fluxos</a>
            <a href="#beneficios" className="hover:text-foreground">Benefícios</a>
            <a href="#contato" className="hover:text-foreground">Contato</a>
            <Link href="/visit" className="hover:text-foreground">
              <Button variant="secondary" className="rounded-full">
                Sou turista
              </Button>
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-border/60 px-4 py-2 text-foreground hover:bg-muted"
            >
              Entrar
            </Link>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-6 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12">
          <div className="flex flex-col gap-6 duration-700 animate-in fade-in slide-in-from-bottom-4">
            <span className="w-fit rounded-full bg-secondary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              Gestão urbana moderna
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Transforme reclamações em resoluções com um fluxo claro e humano.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Urbanify conecta moradores, fiscais e gestores em um processo auditável.
              Registre problemas, valide com responsabilidade e acompanhe cada etapa
              até a solução final.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contato"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                Entre em contato
              </a>
              <Link
                href="/visit"
                className="inline-flex items-center justify-center rounded-full border border-border/60 bg-secondary px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/70"
              >
                Sou turista
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-border/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Acessar painel
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Registro rápido</span>
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Validação transparente</span>
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Gestão por status</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur duration-700 animate-in fade-in slide-in-from-bottom-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Fluxo de ocorrência</span>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Ao vivo
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Problema reportado</span>
                    <span>14:08</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">Buraco na Rua 12</p>
                  <p className="text-xs text-muted-foreground">Fotos e localização anexadas</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Fiscal validou</span>
                    <span>15:02</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">Confirmado e atribuído</p>
                  <p className="text-xs text-muted-foreground">Gestão assumiu a resolução</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-accent/40 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Solucao registrada</span>
                    <span>17:10</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">Reparo concluído</p>
                  <p className="text-xs text-muted-foreground">Encerrado com evidencia</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden w-48 rounded-2xl border border-border/60 bg-card/90 p-4 shadow-lg md:block">
              <p className="text-xs text-muted-foreground">Tempo médio de resolução</p>
              <p className="mt-2 text-2xl font-semibold">36h</p>
              <p className="text-xs text-muted-foreground">-18% no último trimestre</p>
            </div>
          </div>
        </section>
      </div>

      <section id="fluxos" className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Fluxos que conectam quem importa</h2>
            <p className="text-base text-muted-foreground">
              Cada etapa foi desenhada para reduzir ruído, acelerar decisão e garantir
              que problemas reais virem ações visíveis.
            </p>
          </div>
          <div className="space-y-4">
            {flowSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {highlightCards.map(card => (
            <div key={card.title} className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="escopo" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex flex-col gap-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold">Um ecossistema completo para a cidade</h2>
            <p className="text-base text-muted-foreground">
              A contratação contempla acesso integral e ilimitado, sem cobrança por volume
              de uso, usuários ou dados. Cada módulo foi desenhado para gerar impacto real.
            </p>
          </div>

          <div className="space-y-10">
            {scopeScenes.map(scene => (
              <div
                key={scene.title}
                className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm md:p-8"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${scene.accent}`} />
                <div className="relative grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {scene.tag}
                    </span>
                    <h3 className="mt-3 text-2xl font-semibold">{scene.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{scene.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {scene.highlight.map(item => (
                        <span key={item} className="rounded-full bg-card px-3 py-1 shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  {scene.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Mapa vivo de ocorrências</h2>
            <p className="text-base text-muted-foreground">
              Visualize rapidamente onde estão os problemas, o status de cada
              área e quais equipes estão atuando. Tudo em um único painel,
              sem ruído.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Reportado</span>
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Em validação</span>
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Em gestão</span>
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Resolvido</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(3,78,255,0.12),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(16,255,141,0.18),transparent_55%),radial-gradient(circle_at_50%_80%,rgba(239,245,73,0.18),transparent_60%)]" />
            <div className="relative h-[360px] rounded-2xl border border-border/60 bg-background/60 p-4">
              <div className="absolute inset-4 rounded-xl border border-dashed border-border/70" />
              <div className="absolute left-6 top-10 h-12 w-24 rounded-full bg-primary/15 blur-xl" />
              <div className="absolute right-10 top-24 h-16 w-28 rounded-full bg-accent/30 blur-xl" />
              <div className="absolute bottom-16 left-24 h-10 w-20 rounded-full bg-secondary/60 blur-xl" />

              {mapPins.map(pin => (
                <div
                  key={pin.name}
                  className={`absolute ${pin.position} flex items-center gap-2 rounded-full bg-card px-3 py-1 shadow-sm`}
                >
                  <span className="size-2 rounded-full bg-primary" />
                  <div className="text-xs">
                    <p className="font-semibold">{pin.name}</p>
                    <p className="text-[10px] text-muted-foreground">{pin.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Mapa ilustrativo. Integração com Google Maps no painel real.
            </p>
          </div>
        </div>
      </section>

      <section id="anuncios" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Anúncios que valorizam negócios locais</h2>
            <p className="text-base text-muted-foreground">
              Os anúncios dentro do Urbanify ampliam a visibilidade de negócios da cidade,
              com campanhas por território, ofertas exclusivas e comunicação relevante para
              quem usa a plataforma.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Promoções exclusivas</span>
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Segmentação por bairros</span>
              <span className="rounded-full bg-card px-3 py-1 shadow-sm">Mais alcance local</span>
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Campanha destaque</p>
                <p className="mt-2 text-sm font-semibold">Restaurante Central</p>
                <p className="text-xs text-muted-foreground">Oferta exclusiva para moradores</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Promoção local</p>
                <p className="mt-2 text-sm font-semibold">Farmácia Zona Norte</p>
                <p className="text-xs text-muted-foreground">Desconto em medicamentos</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 sm:col-span-2">
                <p className="text-xs text-muted-foreground">Relatório de impacto</p>
                <p className="mt-2 text-sm font-semibold">+38% engajamento em 30 dias</p>
                <p className="text-xs text-muted-foreground">Campanhas com alto retorno local</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-border/60 bg-secondary/40 p-10 text-center shadow-sm">
          <h2 className="text-3xl font-semibold">Pronto para transformar sua cidade?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            Nosso time está pronto para ajudar você a implementar um fluxo completo de
            registro, validação e gestão de problemas urbanos.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:contato@urbanify.com"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              Entre em contato
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-border/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Ver painel agora
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo-full.svg" alt="Urbanify" width={160} height={46} />
              </Link>
              <p className="text-sm text-muted-foreground">
                Operação urbana inteligente para conectar moradores, fiscais e gestores em um fluxo claro.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="rounded-full border border-border/60 px-3 py-1">Mapas e dados</span>
                <span className="rounded-full border border-border/60 px-3 py-1">Fluxos auditáveis</span>
                <span className="rounded-full border border-border/60 px-3 py-1">Participação pública</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plataforma</p>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <a href="#fluxos" className="hover:text-foreground">Fluxos</a>
                <a href="#beneficios" className="hover:text-foreground">Benefícios</a>
                <a href="#anuncios" className="hover:text-foreground">Anúncios</a>
                <Link href="/visit" className="hover:text-foreground">Sou turista</Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contato</p>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <a href="mailto:contato@urbanify.com" className="hover:text-foreground">contato@urbanify.com</a>
                <a href="#contato" className="hover:text-foreground">Fale com nosso time</a>
                <Link href="/login" className="hover:text-foreground">Acessar painel</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>Urbanify. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Política de privacidade</span>
              <span>Termos de uso</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Home');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      title: t('title'),
      description: t('description'),
    },
  };
}
