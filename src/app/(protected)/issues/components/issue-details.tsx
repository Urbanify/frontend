'use client';
import { Marker, useLoadScript } from '@react-google-maps/api';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { BannerAd } from '@/components/ui/ads/banner';
import { SquareAd } from '@/components/ui/ads/square';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel/carousel';
import { Label } from '@/components/ui/label/label';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { Textarea } from '@/components/ui/textarea/textarea';

import { useAd } from '@/contexts/ads/useAd';

import { IssueHistoryDetails } from './issue-history-details';
import IssueStatusBadge from './issue-status-badge';

import type { IssueDetails } from '@/types/Issue';

type IssuesTableProps = {
  issue: IssueDetails;
};

export function IssueDetailment({ issue }: IssuesTableProps) {
  const { currentAd } = useAd();
  const [openHistory, setOpenHistory] = useState(false);
  const t = useTranslations('Issues');

  const position: google.maps.LatLngLiteral = {
    lat: +issue.latitude,
    lng: +issue.longitude,
  };

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  return (
    <div className="flex flex-col items-center">
      <IssueHistoryDetails issue={issue} open={openHistory} setOpen={setOpenHistory} />
      <Card className="w-full max-w-fit bg-primary-foreground md:w-fit md:min-w-[460px] lg:w-full">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <span>
              {t(`types.${issue.category}`)}
              {' - '}
              {t(`types.${issue.type}`)}
            </span>
            <div className="flex w-full justify-between gap-2 md:w-fit md:flex-col">
              <IssueStatusBadge status={issue.status} />
              <Button size="sm" onClick={() => setOpenHistory(true)}>{t('AccessPage.history')}</Button>
            </div>
          </CardTitle>
          <CardDescription>
            <div className="mt-2 flex flex-row gap-2 md:mt-0">
              <span>
                {t('table.id')}
                :
              </span>
              {issue.id}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="relative grid gap-2">
            <Label htmlFor="issue_description">{t('AccessPage.description')}</Label>
            <Textarea className="pointer-events-none resize-none" id="issue_description" defaultValue={issue.description} />
          </div>

          <div className="mx-auto">
            <BannerAd
              href={currentAd?.banner?.href ?? ''}
              desktopMedia={currentAd?.banner?.desktop ?? ''}
              mobileMedia={currentAd?.banner?.mobile ?? ''}
            />
          </div>

          {!!issue.photos?.length && (
            <div className="relative grid gap-2">
              <Label htmlFor="issue_photos">{t('AccessPage.photos')}</Label>
              <Carousel className="mx-auto w-full max-w-xs">
                {issue.photos.length > 1 && <CarouselPrevious />}
                <CarouselContent className="">
                  {issue.photos.map((_, index) => (
                    <CarouselItem key={issue.photos?.[index]} className="flex !size-[300px] items-center justify-center">
                      <Image
                        src={issue.photos?.[index] ?? ''}
                        width={300}
                        height={300}
                        className="size-[300px] rounded-lg bg-background object-contain"
                        alt={`Photo ${index + 1}`}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {issue.photos.length > 1 && <CarouselNext />}
              </Carousel>
            </div>
          )}

          <div className="relative grid gap-2">
            {' '}
            <Label>{t('AccessPage.location')}</Label>

            <div className="h-[50dvh] w-full overflow-hidden rounded-lg">
              {isLoaded
                ? (
                    <GoogleMaps
                      center={position}
                      zoom={14}
                      options={{
                        controlSize: 30,
                        draggableCursor: 'pointer',
                        draggingCursor: 'all-scroll',
                      }}
                    >
                      <Marker position={position} />
                    </GoogleMaps>
                  )
                : <Skeleton className="h-[50dvh]" />}
            </div>
          </div>

        </CardContent>
      </Card>
      <div className="mt-2">
        <SquareAd
          href={currentAd?.banner?.href ?? ''}
          desktopMedia={currentAd?.banner?.desktop ?? ''}
          mobileMedia={currentAd?.banner?.mobile ?? ''}
        />
      </div>
    </div>
  );
}
