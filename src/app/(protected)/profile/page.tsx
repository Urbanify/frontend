import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

import { api } from '@/services/api';

export default async function ProfilePage() {
  const t = await getTranslations('Profile');
  const response = await api.users.getMe({ fetchServerSide: true });
  const payload = response.ok ? await response.json() : null;

  return (
    <div className="px-4">
      <div className="mb-6 pl-12">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">{t('details_title')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('fields.name')}</Label>
                <Input value={payload ? `${payload.name} ${payload.surname}` : ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>{t('fields.email')}</Label>
                <Input value={payload?.email ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>{t('fields.cpf')}</Label>
                <Input value={payload?.cpf ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>{t('fields.created_at')}</Label>
                <Input value={payload?.createdAt ? dayjs(payload.createdAt).format('DD/MM/YYYY') : ''} disabled />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-sm font-semibold">{t('stats_title')}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">
                  {t('stats.reported', { count: payload?.createdIssuesCount ?? 0 })}
                </Badge>
                <Badge variant="info">
                  {t('stats.fiscal', { count: payload?.fiscalOfIssuesCount ?? 0 })}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">{t('upcoming_title')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label>{t('fields.photo')}</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input value={t('disabled_placeholder')} disabled />
                <Button variant="outline" disabled>{t('actions.change_photo')}</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('fields.city')}</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input value={t('disabled_placeholder')} disabled />
                <Button variant="outline" disabled>{t('actions.change_city')}</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('fields.password')}</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input value={t('disabled_placeholder')} disabled />
                <Button variant="outline" disabled>{t('actions.change_password')}</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t('soon_hint')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Profile');
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
