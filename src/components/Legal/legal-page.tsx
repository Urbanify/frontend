import Link from 'next/link';

import { Footer } from '@/components/Home/footer';
import { LandingHeader } from '@/components/Home/landing-header';

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  summary: string[];
  sections: LegalSection[];
};

// Inline markup used in the legal texts: **bold** and [label](href).
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
const linkClass = 'text-primary underline underline-offset-4 hover:text-navy';

function renderInline(text: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;

  for (const [whole, bold, label = '', href = ''] of text.matchAll(INLINE)) {
    const index = text.indexOf(whole, last);
    if (index > last) {
      nodes.push(text.slice(last, index));
    }

    if (bold) {
      nodes.push(<strong key={index} className="font-semibold text-navy">{bold}</strong>);
    } else if (href.startsWith('/')) {
      nodes.push(<Link key={index} href={href} className={linkClass}>{label}</Link>);
    } else {
      nodes.push(<a key={index} href={href} className={linkClass}>{label}</a>);
    }

    last = index + whole.length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes;
}

// Static content: the first text of each block is unique within its section.
function blockKey(block: LegalBlock) {
  if (block.type === 'p') {
    return block.text;
  }

  return block.type === 'ul' ? block.items.join('|') : block.head.join('|');
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === 'p') {
    return <p>{renderInline(block.text)}</p>;
  }

  if (block.type === 'ul') {
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
        {block.items.map(item => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }

  return (
    // On mobile each row stacks, and the column name comes from data-label; from md up it is a plain table.
    <div className="rounded-lg border border-border">
      <table className="block w-full border-collapse text-left text-[15px] md:table">
        <thead className="hidden bg-secondary md:table-header-group">
          <tr>
            {block.head.map(heading => (
              <th key={heading} scope="col" className="p-3 font-semibold text-navy">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {block.rows.map(row => (
            <tr key={row.join('|')} className="block border-t border-border align-top first:border-t-0 md:table-row">
              {row.map((cell, index) => (
                <td
                  key={cell}
                  data-label={block.head[index]}
                  className={`block p-3 md:table-cell ${index === 0 ? 'font-medium text-navy' : ''} before:mb-1 before:block before:text-[13px] before:font-normal before:text-muted-foreground before:content-[attr(data-label)] md:before:hidden`}
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalPage({ legal }: { legal: LegalDocument }) {
  const toc = (
    <ul className="space-y-1 text-[15px]">
      {legal.sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex min-h-11 items-center gap-3 rounded-md px-2 text-muted-foreground hover:bg-accent hover:text-navy"
          >
            <span className="tabular-nums">{`${index + 1}.`}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div id="main" className="min-h-svh bg-background text-foreground">
      <LandingHeader variant="compact" />

      <div className="mx-auto w-full max-w-[1160px] px-6 pb-16 pt-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 lg:pt-14">
        <aside className="hidden lg:block">
          <nav aria-label="Neste documento" className="sticky top-28">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Neste documento</p>
            {toc}
          </nav>
        </aside>

        <article className="min-w-0 max-w-[70ch]">
          <h1 className="font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">{legal.title}</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Última atualização:
            {' '}
            {legal.lastUpdated}
          </p>
          {/* ponytail: remove once a lawyer reviews the text and the v2 production setup matches it */}
          <p role="note" className="mt-4 rounded-lg border border-tone-amber-fg/30 bg-tone-amber-bg p-3 text-[15px] text-tone-amber-fg">
            Versão preliminar, em revisão jurídica. Este ambiente é de demonstração e usa apenas dados fictícios.
          </p>

          <details className="mt-8 rounded-lg border border-border bg-card p-4 lg:hidden">
            <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-navy">Neste documento</summary>
            <div className="mt-2">{toc}</div>
          </details>

          <section aria-labelledby="legal-summary" className="mt-8 rounded-lg border border-border bg-card p-6 md:p-8">
            <h2 id="legal-summary" className="font-display text-lg font-semibold text-navy">Em resumo</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-muted-foreground">
              {legal.summary.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {legal.sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mt-12 scroll-mt-28">
              <h2 className="font-display text-xl font-semibold text-navy md:text-2xl">
                <span className="mr-2 tabular-nums text-muted-foreground">{`${index + 1}.`}</span>
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 leading-7">
                {section.blocks.map(block => (
                  <Block key={blockKey(block)} block={block} />
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>

      <Footer />
    </div>
  );
}
