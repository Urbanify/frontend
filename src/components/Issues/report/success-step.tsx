'use client';

import { CircleCheck } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button/button';

export type SuccessStepProps = {
  /** First 6 characters of the new issue id. Omitted when the API does not return one. */
  protocol?: string;
  followHref: string;
};

export function SuccessStep({ protocol, followHref }: SuccessStepProps) {
  const t = useTranslations('Report.success');

  return (
    <section className="space-y-6">
      <span className="flex size-14 items-center justify-center rounded-full bg-tone-green-bg text-tone-green-fg">
        <CircleCheck className="size-7" aria-hidden />
      </span>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-navy md:text-[28px]">
          {t('title')}
        </h1>
        {protocol && (
          <p className="tabular-nums text-muted-foreground">
            {t('protocol')}
            {' '}
            <span className="font-semibold text-navy">{`#${protocol}`}</span>
          </p>
        )}
      </div>

      <div className="space-y-3 rounded-xl border bg-card p-4">
        <h2 className="font-semibold text-navy">{t('next_title')}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>{t('next_1')}</li>
          <li>{t('next_2')}</li>
          <li>{t('next_3')}</li>
        </ol>
      </div>

      <Button asChild className="h-12 w-full">
        <Link href={followHref}>{t('follow')}</Link>
      </Button>
    </section>
  );
}
