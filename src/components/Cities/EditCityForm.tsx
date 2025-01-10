'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LatLngTuple } from 'leaflet';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import LeafletMap from '@/components/leaflet-map/leaflet-map';
import Marker from '@/components/leaflet-map/marker';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Switch } from '@/components/ui/switch/switch';

import CityStatusBadge from '@/app/(protected)/(admin)/cities/components/city-status-badge';
import { editCitySchema } from '@/schemas/city/edit.schema';
import { fetcher } from '@/services/api';

import type { City, CityFeatureFlag } from '@/types/City';

type EditCityFormData = {
  name: string;
  featureFlags: CityFeatureFlag[];
};

export default function EditCityForm({ city }: { city: City }) {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('Cities.EditPage');
  const formSchema = editCitySchema(t as unknown as (arg: string) => string);

  const position = [+city.latitude, +city.longitude] as LatLngTuple;
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
      const response = await fetcher(`/cities/${city.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }, session?.access_token);

      if (!response.ok) {
        throw new Error(t('error'));
      }

      toast.success(t('success'));
      router.push('/cities');
    } catch {
      toast.error(t('error'));
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
              <Label htmlFor="city-name">{t('city_name')}</Label>
              <Input id="city-name" type="text" placeholder={t('city_name_placeholder')} required {...register('name')} />
              {methods.formState.errors.name && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.name.message}</span>}
            </div>

            <div className="relative grid gap-2">
              <div className="h-[50dvh] w-full overflow-hidden rounded-lg">
                <LeafletMap posix={position} zoom={4}>
                  {position ? <Marker posix={position} /> : null}
                </LeafletMap>
              </div>
            </div>

          </CardContent>
          <CardFooter className="w-full">
            <div className="flex flex-1 justify-between gap-2">
              <Button variant="outline">
                {t('go_back')}
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
            {methods.watch('featureFlags').map((ff: CityFeatureFlag) => (
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
