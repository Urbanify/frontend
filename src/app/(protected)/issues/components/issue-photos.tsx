'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog/dialog';

type IssuePhotosProps = {
  photos: string[];
  className?: string;
};

// First photo is large, the rest are thumbnails. Click opens the full photo in a dialog.
export function IssuePhotos({ photos, className }: IssuePhotosProps) {
  const t = useTranslations('IssueDetail');
  const [current, setCurrent] = useState<number | null>(null);
  const total = photos.length;
  const currentSrc = current === null ? null : photos[current];

  return (
    <section className={cn('rounded-lg border border-border bg-card p-5', className)}>
      <h2 className="text-sm font-semibold text-navy">{t('photos')}</h2>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {photos.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={t('photoOpen', { number: index + 1 })}
            className={cn(
              'relative overflow-hidden rounded-md bg-muted transition-transform duration-100 active:scale-[0.98]',
              index === 0 ? 'col-span-3 h-80' : 'aspect-square',
            )}
          >
            <Image
              src={src}
              alt={t('photoNumber', { number: index + 1, total })}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog open={current !== null} onOpenChange={open => !open && setCurrent(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-4xl">
          <DialogTitle className="sr-only">{t('photos')}</DialogTitle>
          <DialogDescription className="sr-only">
            {current !== null && t('photoNumber', { number: current + 1, total })}
          </DialogDescription>

          {currentSrc && (
            <div className="relative h-[70dvh] w-full">
              <Image
                src={currentSrc}
                alt={current !== null ? t('photoNumber', { number: current + 1, total }) : ''}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-contain"
              />
            </div>
          )}

          {total > 1 && (
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                disabled={current === 0}
                onClick={() => setCurrent(prev => (prev === null ? null : prev - 1))}
              >
                <ChevronLeft aria-hidden />
                {t('previousPhoto')}
              </Button>
              <span className="text-sm tabular-nums text-muted-foreground">
                {current !== null && t('photoNumber', { number: current + 1, total })}
              </span>
              <Button
                variant="outline"
                disabled={current === total - 1}
                onClick={() => setCurrent(prev => (prev === null ? null : prev + 1))}
              >
                {t('nextPhoto')}
                <ChevronRight aria-hidden />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
