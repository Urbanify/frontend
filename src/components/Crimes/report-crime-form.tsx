'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Marker, useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Env } from '@/libs/Env';

import { animateMarker } from '@/components/google-map/animate-marker';
import { GoogleMaps } from '@/components/google-map/google-map';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Combobox } from '@/components/ui/combobox/combobox';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { Textarea } from '@/components/ui/textarea/textarea';

import { BRAZIL_POSITION } from '@/constants/BRAZIL_POSITION';
import { api } from '@/services/api';
import { parseJwt } from '@/utils/decodeJWT';

import { crimeCategories } from '@/types/Crime';

type CrimeReportData = {
  category: string;
  type: string;
  address: string;
  date: string;
  time: string;
  description: string;
  latitude: string;
  longitude: string;
};

export function ReportCrimeForm() {
  const t = useTranslations('Crimes.ReportPage');
  const { data: session } = useSession();
  const router = useRouter();
  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: BRAZIL_POSITION.lat,
    lng: BRAZIL_POSITION.lng,
  });
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const formSchema = z.object({
    type: z.string().min(1, t('crimeType_required')),
    date: z.string().min(1, t('date_required')),
    time: z.string().min(1, t('time_required')),
    address: z.string().min(1),
    description: z.string().min(1),
  });

  const { register, ...methods } = useForm<CrimeReportData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      category: '',
      type: '',
      address: '',
      date: '',
      time: '',
      description: '',
      latitude: `${BRAZIL_POSITION.lat}`,
      longitude: `${BRAZIL_POSITION.lng}`,
    },
  });

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const handleSelectCrimeType = (value: string) => {
    const result = [];
    for (const option of crimeCategories) {
      result.push(option);
      if (option.value === value) {
        break;
      }
    }
    const reversedResult = result.reverse();
    const category = reversedResult
      .find(option => option.isHeading)
      ?.value ?? '';

    methods.setValue('type', value);
    methods.setValue('category', category);
  };

  const updatePosition = (newPosition: google.maps.LatLngLiteral) => {
    animateMarker(position, newPosition, setPosition);
    methods.setValue('latitude', String(newPosition.lat));
    methods.setValue('longitude', String(newPosition.lng));
  };

  const handleChangePosition = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) {
      return;
    }
    const newPosition: google.maps.LatLngLiteral = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    updatePosition(newPosition);
  };

  const onLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (!autocomplete) {
      return;
    }
    const place = autocomplete.getPlace();
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (typeof lat === 'number' && typeof lng === 'number') {
      updatePosition({ lat, lng });
    }
  };

  useEffect(() => {
    const parsed = parseJwt(session?.access_token);
    const cityId = parsed?.user?.cityId;

    const fallbackToCity = async () => {
      if (!cityId || !session?.access_token) {
        updatePosition(BRAZIL_POSITION);
        return;
      }
      try {
        const response = await api.instance(`/cities/${cityId}`, {
          method: 'GET',
        }, session.access_token);

        if (!response.ok) {
          updatePosition(BRAZIL_POSITION);
          return;
        }
        const city = await response.json();
        const lat = Number.parseFloat(city?.latitude);
        const lng = Number.parseFloat(city?.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          updatePosition({ lat, lng });
          return;
        }
        updatePosition(BRAZIL_POSITION);
      } catch {
        updatePosition(BRAZIL_POSITION);
      }
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updatePosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          void fallbackToCity();
        },
        { timeout: 8000, enableHighAccuracy: true },
      );
    } else {
      void fallbackToCity();
    }
  }, [session?.access_token]);

  const onSubmit = async (values: CrimeReportData) => {
    try {
      const happenedAt = values.date && values.time
        ? `${values.date}T${values.time}:00.000Z`
        : '';
      const payload = {
        category: values.category,
        type: values.type,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        happenedAt,
        description: values.description,
      };
      await api.crimes.create(payload);
      toast.success(t('success'));
      router.push('/crimes');
    } catch {
      toast.error(t('error'));
    }
  };

  return (
    <FormProvider {...methods} register={register}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('crimeType')}</Label>
              <Combobox
                options={crimeCategories}
                placeholder={t('crimeType_placeholder')}
                value={methods.watch('type')}
                setValue={handleSelectCrimeType}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('address')}</Label>
              <Input placeholder={t('address_placeholder')} {...register('address')} />
            </div>
            <div className="space-y-2">
              <Label>{t('date')}</Label>
              <Input type="date" {...register('date')} />
            </div>
            <div className="space-y-2">
              <Label>{t('time')}</Label>
              <Input type="time" {...register('time')} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t('details')}</Label>
              <Textarea
                className="min-h-[120px]"
                placeholder={t('details_placeholder')}
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>{t('location')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                {isLoaded
                  ? (
                      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <div>
                          <Label htmlFor="address">{t('address')}</Label>
                          <p className="text-xs text-muted-foreground">{t('location_description')}</p>
                          <Input id="address" type="text" placeholder={t('address_placeholder')} {...register('address')} />
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
            </div>
            <div className="h-[320px] w-full overflow-hidden rounded-xl border border-border/60">
              {isLoaded
                ? (
                    <GoogleMaps
                      center={position}
                      zoom={13}
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
                : <Skeleton className="h-[320px]" />}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={disableButton}>
            {t('submit')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
