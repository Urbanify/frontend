'use client';

import { Camera, ImageUp, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button/button';

import { MAX_PHOTOS, type StepProps } from './draft';

export function PhotoStep({ draft, onChange, onNext }: StepProps) {
  const t = useTranslations('Report.photo');
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [limitReached, setLimitReached] = useState(false);
  const full = draft.photos.length >= MAX_PHOTOS;

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const room = MAX_PHOTOS - draft.photos.length;
    const picked = Array.from(files)
      .slice(0, room)
      .map(file => ({ file, url: URL.createObjectURL(file) }));

    setLimitReached(files.length > room);
    onChange({ photos: [...draft.photos, ...picked] });
  };

  const removePhoto = (index: number) => {
    const photo = draft.photos[index];
    if (photo) {
      URL.revokeObjectURL(photo.url);
    }
    setLimitReached(false);
    onChange({ photos: draft.photos.filter((_, i) => i !== index) });
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-navy md:text-[28px]">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" className="h-14" disabled={full} onClick={() => cameraRef.current?.click()}>
          <Camera aria-hidden />
          {t('take')}
        </Button>
        <Button variant="outline" size="lg" className="h-14" disabled={full} onClick={() => galleryRef.current?.click()}>
          <ImageUp aria-hidden />
          {t('gallery')}
        </Button>
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = '';
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = '';
        }}
      />

      <div className="space-y-2" aria-live="polite">
        <p className="text-sm tabular-nums text-muted-foreground">{t('count', { count: draft.photos.length, max: MAX_PHOTOS })}</p>
        {limitReached && <p role="alert" className="text-sm text-destructive">{t('limit')}</p>}
      </div>

      {draft.photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {draft.photos.map((photo, index) => (
            <li key={photo.url} className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
              <Image src={photo.url} alt={t('alt', { n: index + 1 })} fill sizes="120px" unoptimized className="object-cover" />
              <button
                type="button"
                aria-label={t('remove', { n: index + 1 })}
                onClick={() => removePhoto(index)}
                className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-full bg-navy text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="size-5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button className="h-12 w-full" onClick={onNext}>
        {draft.photos.length > 0 ? t('continue') : t('skip')}
      </Button>
    </section>
  );
}
