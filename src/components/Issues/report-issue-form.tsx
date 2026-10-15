'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';

import { api } from '@/services/api';
import { images } from '@/services/images';

import { EMPTY_DRAFT, type ReportDraft, TOTAL_STEPS } from './report/draft';
import { LocationStep } from './report/location-step';
import { PhotoStep } from './report/photo-step';
import { ReviewStep } from './report/review-step';
import { SuccessStep } from './report/success-step';
import { TypeStep } from './report/type-step';

export type ReportIssueData = {
  address: string;
  latitude: string;
  longitude: string;
  photos: string[];
  category: string;
  type: string;
  description: string;
};

const SUCCESS_STEP = TOTAL_STEPS + 1;

export function ReportIssueForm() {
  const t = useTranslations('Report');
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ReportDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ id?: string } | null>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  // Each step starts at the top, with focus on it so screen readers announce it.
  useEffect(() => {
    stepRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [step]);

  const update = (patch: Partial<ReportDraft>) => setDraft(current => ({ ...current, ...patch }));
  const next = () => setStep(current => current + 1);
  const back = () => setStep(current => current - 1);

  const handleSubmit = async () => {
    const { location } = draft;

    if (!location) {
      return;
    }

    setSubmitting(true);
    try {
      const uploadPromises = draft.photos.map(photo => images.upload(photo.file));
      const responses = await Promise.all(uploadPromises);
      const photoUrls = responses.map(response => response?.data.url).filter(Boolean) as string[];

      const payload: ReportIssueData = {
        address: draft.address,
        latitude: `${location.lat}`,
        longitude: `${location.lng}`,
        photos: photoUrls,
        category: draft.category,
        type: draft.type,
        description: draft.description,
      };

      const response = await api.issues.report(payload);

      if (!response.ok) {
        throw new Error(t('error'));
      }

      // The create call may not return the new issue. Without an id, "Acompanhar" goes to the citizen's list.
      const body = await response.json().catch(() => null) as { id?: unknown } | null;
      setCreated({ id: typeof body?.id === 'string' ? body.id : undefined });
      setStep(SUCCESS_STEP);
    } catch {
      toast.error(t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  const followHref = created?.id ? `/issues/view/${created.id}` : '/issues/mine';

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      {step <= TOTAL_STEPS && (
        <header className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            {step === 1
              ? (
                  <Button asChild variant="ghost" className="-ml-3">
                    <Link href="/issues">
                      <ArrowLeft aria-hidden />
                      {t('back')}
                    </Link>
                  </Button>
                )
              : (
                  <Button variant="ghost" className="-ml-3" onClick={back}>
                    <ArrowLeft aria-hidden />
                    {t('back')}
                  </Button>
                )}
            <p className="text-sm tabular-nums text-muted-foreground">{t('progress', { step, total: TOTAL_STEPS })}</p>
          </div>
          <div aria-hidden className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, index) => (
              <span key={index} className={cn('h-1.5 flex-1 rounded-full', index < step ? 'bg-primary' : 'bg-secondary')} />
            ))}
          </div>
        </header>
      )}

      <div ref={stepRef} tabIndex={-1} className="outline-none">
        {step === 1 && <TypeStep draft={draft} onChange={update} onNext={next} />}
        {step === 2 && <PhotoStep draft={draft} onChange={update} onNext={next} />}
        {step === 3 && <LocationStep draft={draft} onChange={update} onNext={next} />}
        {step === TOTAL_STEPS && (
          <ReviewStep draft={draft} submitting={submitting} onChange={update} onSubmit={handleSubmit} />
        )}
        {step === SUCCESS_STEP && (
          <SuccessStep protocol={created?.id?.slice(0, 6)} followHref={followHref} />
        )}
      </div>
    </div>
  );
}
