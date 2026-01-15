'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Marker, useLoadScript } from '@react-google-maps/api';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Env } from '@/libs/Env';

import { animateMarker } from '@/components/google-map/animate-marker';
import { GoogleMaps } from '@/components/google-map/google-map';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Combobox } from '@/components/ui/combobox/combobox';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { Textarea } from '@/components/ui/textarea/textarea';

import { BRAZIL_POSITION } from '@/constants/BRAZIL_POSITION';
import { reportIssueSchema } from '@/schemas/issues/report.schema';
import { api } from '@/services/api';
import { images } from '@/services/images';

import { issueCategories } from '@/types/Issue';

export type ReportIssueData = {
  address: string;
  latitude: string;
  longitude: string;
  photos: string[];
  category: string;
  type: string;
  description: string;
};

export function ReportIssueForm() {
  const [localPhotos, setLocalPhotos] = useState<File[]>([]);
  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: BRAZIL_POSITION.lat,
    lng: BRAZIL_POSITION.lng,
  });
  const router = useRouter();
  const t = useTranslations('Issues.ReportPage');
  const formSchema = reportIssueSchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<ReportIssueData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      address: '',
      latitude: `${BRAZIL_POSITION.lat}`,
      longitude: `${BRAZIL_POSITION.lng}`,
      photos: [],
      category: '',
      description: '',
      type: '',
    },
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const handleSelectIssueType = (value: string) => {
    const result = [];

    // Passo 1: Iterar pelas opções até encontrar o valor
    for (const option of issueCategories) {
      result.push(option); // Adiciona a opção ao resultado
      if (option.value === value) {
        break; // Sai do loop assim que encontrar o valor
      }
    }

    // Passo 2: Inverter o array resultante
    const reversedResult = result.reverse();

    // Passo 3: Procurar o primeiro heading
    const category = reversedResult
      .find(option => option.isHeading)
      ?.label ?? '';

    methods.setValue('type', value);
    methods.setValue('category', category);
  };

  const handleAddPhotos = (files: FileList) => {
    const newFiles = Array.from(files);
    const allFiles = [...localPhotos, ...newFiles];

    if (allFiles.length > 5) {
      methods.setError('photos', {
        type: 'manual',
        message: t('photos_limit_error'),
      });
      setLocalPhotos([]);
      return;
    }

    methods.clearErrors('photos');
    methods.trigger('photos');
    setLocalPhotos(allFiles);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = localPhotos.filter((_, i) => i !== index);
    setLocalPhotos(updatedPhotos);

    const dt = new DataTransfer();
    updatedPhotos.forEach(file => dt.items.add(file));
    const input = document.getElementById('photos') as HTMLInputElement;
    input.files = dt.files;

    if (updatedPhotos.length <= 5) {
      methods.clearErrors('photos');
    }
  };

  const handleSubmit = async (data: ReportIssueData) => {
    try {
      const uploadPromises = localPhotos.map(file => images.upload(file));
      const responses = await Promise.all(uploadPromises);
      const photoUrls = responses.map(response => response?.data.url).filter(Boolean) as string[];

      const payload = { ...data, category: data.category.split('.').at(-1) ?? '', photos: photoUrls };

      const response = await api.issues.report(payload);

      if (!response.ok) {
        throw new Error(t('error'));
      }

      toast.success(t('success'));
      router.push('/issues');
    } catch {
      toast.error(t('error'));
    }
  };

  // GOOGLE MAPS START
  const [autocomplete, setAutocomplete] = useState<any>(null);

  const handleChangePosition = (e: google.maps.MapMouseEvent) => {
    const latlng = e.latLng?.toJSON();

    if (latlng) {
      animateMarker(position, latlng, setPosition);
      methods.setValue('latitude', `${(latlng?.lat)}`);
      methods.setValue('longitude', `${(latlng?.lng)}`);
    }
  };

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const onLoad = (autoC: google.maps.places.Autocomplete) => {
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
  // GOOGLE MAPS END

  return (
    <FormProvider {...methods} register={register}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="flex flex-wrap justify-center gap-4">
        <Card className="w-full max-w-3xl flex-1 border-border/60 bg-card shadow-sm sm:min-w-[630px]">
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label htmlFor="type">{t('issueType')}</Label>
                <p className="text-xs text-muted-foreground">{t('issueType_placeholder')}</p>
                <Combobox
                  placeholder={t('issueType_placeholder')}
                  options={issueCategories}
                  value={methods.watch('type')}
                  setValue={handleSelectIssueType}
                  popoverClassName="w-[370px] sm:max-w-[600px] sm:w-[600px] max-h-[240px]"
                />
                {methods.formState.errors.type && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.type.message}</span>}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label htmlFor="issue_description">{t('issue_description')}</Label>
                <p className="text-xs text-muted-foreground">{t('issue_description_placeholder')}</p>
                <Textarea id="issue_description" placeholder={t('issue_description_placeholder')} required {...register('description')} />
                {methods.formState.errors.description && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.description.message}</span>}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label htmlFor="photos">{t('photos')}</Label>
                <p className="text-xs text-muted-foreground">{t('photos_placeholder')}</p>
                <Input
                  id="photos"
                  multiple
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={e => handleAddPhotos(e.target.files!)}
                />
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {localPhotos.map((photo, index) => (
                    <div key={photo.name} className="relative">
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="size-32 rounded-lg border border-accent-foreground object-cover"
                        width={0}
                        height={0}
                      />
                      <button
                        type="button"
                        className={cn(`absolute -top-1 left-[116px] flex size-6 items-center justify-center transition-all
                        rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive`)}
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {methods.formState.errors.photos && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.photos.message}</span>}
              </div>
            </div>
          </CardContent>

        </Card>

        <Card className="w-full max-w-3xl flex-1 border-border/60 bg-card shadow-sm sm:min-w-[630px]">
          <CardHeader>
            <CardTitle>{t('location')}</CardTitle>
            <CardDescription>
              {t('location_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                {isLoaded
                  ? (
                      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <div>
                          <Label htmlFor="address">{t('address')}</Label>
                          <p className="text-xs text-muted-foreground">{t('address_placeholder')}</p>
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

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <div className="h-[50dvh] w-full overflow-hidden rounded-lg">
                  {isLoaded
                    ? (
                        <GoogleMaps
                          center={position}
                          zoom={16}
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
                {methods.formState.errors.latitude && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.latitude.message}</span>}
              </div>
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
