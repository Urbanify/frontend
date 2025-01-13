'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Marker, useLoadScript } from '@react-google-maps/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Env } from '@/libs/Env';

import { animateMarker } from '@/components/google-map/animate-marker';
import { GoogleMaps } from '@/components/google-map/google-map';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { Switch } from '@/components/ui/switch/switch';

import CityStatusBadge from '@/app/(protected)/(admin)/cities/components/city-status-badge';
import { editCitySchema } from '@/schemas/city/edit.schema';
import { api } from '@/services/api';

import type { City, CityFeatureFlag } from '@/types/City';

export type EditCityFormData = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  featureFlags: CityFeatureFlag[];
};

export default function EditCityForm({ city }: { city: City }) {
  const router = useRouter();
  const t = useTranslations('Cities.EditPage');
  const formSchema = editCitySchema(t as unknown as (arg: string) => string);

  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: +city.latitude,
    lng: +city.longitude,
  });
  const { register, ...methods } = useForm<EditCityFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      ...city,
      featureFlags: city.featureFlags,
    },
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const handleSwitchChange
    = (featureFlagId: string, value: boolean) => {
      const currentFeatures = methods.watch('featureFlags');

      const updatedFeatures = currentFeatures.map((ff: CityFeatureFlag) =>
        ff.featureFlagId === featureFlagId
          ? { ...ff, status: value }
          : ff,
      );
      methods.setValue('featureFlags', updatedFeatures, {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

  const handleSubmit = async (data: EditCityFormData) => {
    try {
      const response = await api.city.update(data);

      if (!response.ok) {
        throw new Error(t('error'));
      }

      toast.success(t('success'));
      router.push('/cities');
    } catch {
      toast.error(t('error'));
    }
  };

  const [autocomplete, setAutocomplete] = useState<any>(null);

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const onLoad = (autoC: any) => {
    setAutocomplete(autoC);
  };

  const updatePosition = (pos: google.maps.LatLngLiteral) => {
    animateMarker(position, pos, setPosition);
    methods.setValue('latitude', `${(pos?.lat)}`);
    methods.setValue('longitude', `${(pos?.lng)}`);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      updatePosition({ lat, lng });
    }
  };

  const handleChangePosition = (e: google.maps.MapMouseEvent) => {
    const latlng = e.latLng?.toJSON();

    if (latlng) {
      updatePosition(latlng);
    }
  };

  return (
    <FormProvider {...methods} register={register}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="flex flex-wrap justify-center gap-4">
        <Card className="w-full max-w-3xl bg-primary-foreground md:w-fit md:min-w-[460px] lg:w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {t('title')}
              </span>
              <CityStatusBadge status={city.status} />
            </CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="relative grid gap-2">
              {isLoaded
                ? (
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                      <div>
                        <Label htmlFor="city-name">{t('city_name')}</Label>
                        <Input id="city-name" type="text" placeholder={t('city_name_placeholder')} required {...register('name')} />
                        {methods.formState.errors.name && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.name.message}</span>}
                      </div>
                    </Autocomplete>
                  )
                : (
                    <>
                      <Skeleton className="h-4 max-w-32" />
                      <Skeleton className="h-10" />
                    </>
                  )}
            </div>

            <div className="relative grid gap-2">
              <div className="h-[50dvh] w-full overflow-hidden rounded-lg">
                {isLoaded
                  ? (
                      <GoogleMaps
                        center={position}
                        zoom={14}
                        onClick={handleChangePosition}
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
          <CardFooter className="w-full">
            <div className="flex flex-1 justify-between gap-2">
              <Button asChild type="button" variant="outline">
                <Link href="../">
                  {t('go_back')}
                </Link>
              </Button>
              <Button disabled={disableButton} type="submit" isLoading={methods.formState.isSubmitting}>
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="w-full bg-primary-foreground md:w-fit md:max-w-2xl lg:min-w-[460px]">
          <CardHeader>
            <CardTitle>{t('features.title')}</CardTitle>
            <CardDescription>
              {t('features.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            {methods.watch('featureFlags')?.map((ff: CityFeatureFlag) => (
              <div className="flex items-center gap-2" key={ff.featureFlagId}>
                <Switch
                  id={ff.featureFlagId}
                  defaultChecked={ff.status}
                  onCheckedChange={checked => handleSwitchChange(ff.featureFlagId, checked)}
                />
                <Label className="cursor-pointer" htmlFor={ff.featureFlagId}>
                  {ff.description}
                </Label>
              </div>
            ))}

          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
