'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button/button';
import { Label } from '@/components/ui/label/label';
import { Textarea } from '@/components/ui/textarea/textarea';

import { MIN_DESCRIPTION, type ReportDraft } from './draft';

export type ReviewStepProps = {
  draft: ReportDraft;
  submitting: boolean;
  onChange: (patch: Partial<ReportDraft>) => void;
  onSubmit: () => void;
};

export function ReviewStep({ draft, submitting, onChange, onSubmit }: ReviewStepProps) {
  const t = useTranslations('Report.review');
  const tTypes = useTranslations('Issues.types');
  const length = draft.description.length;
  const missing = MIN_DESCRIPTION - length;

  return (
    <section className="space-y-6">
      <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-navy md:text-[28px]">
        {t('title')}
      </h1>

      <dl className="divide-y rounded-xl border bg-card">
        <div className="flex items-start justify-between gap-4 p-4">
          <dt className="text-sm text-muted-foreground">{t('type')}</dt>
          <dd className="text-right">
            <span className="block font-semibold text-navy">{draft.type && tTypes(draft.type)}</span>
            <span className="block text-sm text-muted-foreground">{draft.category && tTypes(draft.category)}</span>
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 p-4">
          <dt className="text-sm text-muted-foreground">{t('photos')}</dt>
          <dd className="font-semibold text-navy">{t('photos_count', { count: draft.photos.length })}</dd>
        </div>
        <div className="flex items-start justify-between gap-4 p-4">
          <dt className="text-sm text-muted-foreground">{t('location')}</dt>
          <dd className="max-w-[60%] text-right font-semibold text-navy">
            {draft.address.trim() || t('location_pin')}
          </dd>
        </div>
      </dl>

      <div className="space-y-2">
        <Label htmlFor="description">{t('description')}</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder={t('description_placeholder')}
          value={draft.description}
          onChange={event => onChange({ description: event.target.value })}
          className="text-base"
        />
        <p aria-live="polite" className="text-sm tabular-nums text-muted-foreground">
          {missing > 0 ? t('description_count', { count: length, min: MIN_DESCRIPTION }) : t('description_ok', { count: length })}
        </p>
      </div>

      <Button className="h-12 w-full" disabled={missing > 0 || submitting} isLoading={submitting} onClick={onSubmit}>
        {missing > 0 ? t('submit_missing', { count: missing }) : t('submit')}
      </Button>
    </section>
  );
}
