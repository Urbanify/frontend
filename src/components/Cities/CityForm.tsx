'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LatLngExpression, LatLngLiteral } from 'leaflet';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import LeafletMap from '@/components/leaflet-map/leaflet-map';
import Marker from '@/components/leaflet-map/marker';
import SetViewOnClick from '@/components/leaflet-map/set-view-on-click';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

import { BRAZIL_POSITION } from '@/constants/BRAZIL_POSITION';
import { createCitySchema } from '@/schemas/city/create.schema';
import { fetcher } from '@/services/api';
import { redirectTo } from '@/utils/redirectTo';

type CityFormData = {
  name: string;
  latitude: string;
  longitude: string;
};

export default function CityForm() {
  const [position, setPosition] = useState<LatLngExpression>(BRAZIL_POSITION);
  const { data: session } = useSession();
  const t = useTranslations('Cities.CreatePage');
  const formSchema = createCitySchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<CityFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      latitude: `${BRAZIL_POSITION[0]}`,
      longitude: `${BRAZIL_POSITION[1]}`,
    },
  });
  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const handleChangePosition = (newPosition: LatLngLiteral) => {
    setPosition(newPosition);
    methods.setValue('latitude', `${(newPosition.lat)}`);
    methods.setValue('longitude', `${(newPosition.lng)}`);
  };

  const handleSubmit = async (data: CityFormData) => {
    try {
      const response = await fetcher('/cities', {
        method: 'POST',
        body: JSON.stringify(data),
      }, session?.access_token);

      if (!response.ok) {
        throw new Error(t('error'));
      }

      toast.success(t('success'));
      await redirectTo('/cities');
    } catch {
      toast.error(t('error'));
    }
  };

  return (
    <FormProvider {...methods} register={register}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="flex justify-center">
        <Card className="w-full max-w-3xl bg-primary-foreground">
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="relative grid gap-2">
              <Label htmlFor="city-name">{t('city_name')}</Label>
              <Input id="city-name" type="text" placeholder={t('city_name_placeholder')} required {...register('name')} />
              {methods.formState.errors.name && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.name.message}</span>}
            </div>

            <div className="relative grid gap-2">
              <div className="h-[50dvh] w-full overflow-hidden rounded-lg">
                <LeafletMap posix={position} zoom={4}>
                  {position ? <Marker posix={position} /> : null}
                  <SetViewOnClick setPosition={handleChangePosition} />
                </LeafletMap>
              </div>
              {methods.formState.errors.latitude && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.latitude.message}</span>}
            </div>

          </CardContent>
          <CardFooter className="w-full">
            <div className="flex flex-1 justify-between gap-2">
              <Button variant="outline">
                {t('go_back')}
              </Button>
              <Button disabled={disableButton} type="submit" isLoading={methods.formState.isSubmitting}>
                {t('create')}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
