'use client';
import { Marker, useLoadScript } from '@react-google-maps/api';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { SquareAd } from '@/components/ui/ads/square';
import { Badge } from '@/components/ui/badge/badge';
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
import { issueCategories } from '@/types/Issue';

type IssuesTableProps = {
  issue: IssueDetails;
};

export function IssueDetailment({ issue }: IssuesTableProps) {
  const { currentAd } = useAd();
  const [openHistory, setOpenHistory] = useState(false);
  const t = useTranslations('Issues');

  const getOptionIcon = (value: string) => {
    return issueCategories.find(option => option.value === value)?.icon;
  };
  const getCategoryVariant = (category: IssueDetails['category']) => {
    switch (category) {
      case 'INFRASTRUCTURE':
        return 'warning';
      case 'ENVIRONMENT':
        return 'success';
      case 'TRANSPORTATION':
        return 'info';
      case 'SAFETY':
        return 'danger';
      case 'COMUNITY':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <IssueHistoryDetails issue={issue} open={openHistory} setOpen={setOpenHistory} />
      <Card className="w-full border-border/60 bg-card shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl md:text-2xl">
                {t(`types.${issue.category}`)}
                {' - '}
                {t(`types.${issue.type}`)}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getCategoryVariant(issue.category)} className="gap-2">
                  {(() => {
                    const Icon = getOptionIcon(issue.category);
                    return Icon ? <Icon className="size-3.5" /> : null;
                  })()}
                  {t(`types.${issue.category}`)}
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  {(() => {
                    const Icon = getOptionIcon(issue.type);
                    return Icon ? <Icon className="size-3.5" /> : null;
                  })()}
                  {t(`types.${issue.type}`)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IssueStatusBadge status={issue.status} />
              <Button size="sm" onClick={() => setOpenHistory(true)}>{t('AccessPage.history')}</Button>
            </div>
          </div>
          <CardDescription className="flex flex-wrap gap-4 text-xs">
            <span>
              {t('table.id')}
              :
              {' '}
              #
              {issue.id.slice(0, 6)}
            </span>
            <span>
              {t('table.createdAt')}
              :
              {' '}
              {dayjs(issue.createdAt).format('DD/MM/YYYY HH:mm')}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label htmlFor="issue_description">{t('AccessPage.description')}</Label>
                <Textarea
                  className="resize-none"
                  id="issue_description"
                  defaultValue={issue.description}
                  readOnly
                />
              </div>
            </div>

            {!!issue.photos?.length && (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="relative grid gap-2">
                  <Label htmlFor="issue_photos">{t('AccessPage.photos')}</Label>
                  <Carousel className="mx-auto w-full max-w-xs">
                    {issue.photos.length > 1 && <CarouselPrevious />}
                    <CarouselContent>
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
              </div>
            )}

          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <SquareAd
                href={currentAd?.square?.href ?? ''}
                desktopMedia={currentAd?.square?.desktop ?? ''}
                mobileMedia={currentAd?.square?.mobile ?? ''}
              />
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
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
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
