'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Marker, useLoadScript } from '@react-google-maps/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
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

import { BRAZIL_POSITION } from '@/constants/BRAZIL_POSITION';
import { createCitySchema } from '@/schemas/city/create.schema';
import { api } from '@/services/api';

export type CityFormData = {
  name: string;
  latitude: string;
  longitude: string;
};

export default function CityForm() {
  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: BRAZIL_POSITION.lat,
    lng: BRAZIL_POSITION.lng,
  });
  const router = useRouter();
  const t = useTranslations('Cities.CreatePage');
  const formSchema = createCitySchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<CityFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      latitude: `${BRAZIL_POSITION.lat}`,
      longitude: `${BRAZIL_POSITION.lng}`,
    },
  });
  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const handleChangePosition = (e: google.maps.MapMouseEvent) => {
    const latlng = e.latLng?.toJSON();

    if (latlng) {
      animateMarker(position, latlng, setPosition);
      methods.setValue('latitude', `${(latlng?.lat)}`);
      methods.setValue('longitude', `${(latlng?.lng)}`);
    }
  };

  const handleSubmit = async (data: CityFormData) => {
    try {
      const response = await api.city.create(data);

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

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      animateMarker(position, { lat, lng }, setPosition);
    }
  };

  useEffect(() => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition((newPos) => {
        const lat = newPos.coords.latitude;
        const lng = newPos.coords.longitude;

        animateMarker(position, { lat, lng }, setPosition);
      });
    }
  }, []);

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
                        zoom={4}
                        onClick={handleChangePosition}
                        options={{
                          controlSize: 30,
                          draggableCursor: 'pointer',
                          draggingCursor: 'all-scroll',
                        }}
                      >
                        <Marker
                          position={position}
                          animation={google.maps.Animation.DROP}
                        />
                      </GoogleMaps>
                    )
                  : <Skeleton className="h-[50dvh]" />}
              </div>
              {methods.formState.errors.latitude && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.latitude.message}</span>}
            </div>

          </CardContent>
          <CardFooter className="w-full">
            <div className="flex flex-1 justify-between gap-2">
              <Button asChild type="button" variant="outline">
                <Link href="/cities">
                  {t('go_back')}
                </Link>
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
