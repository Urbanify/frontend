'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { CATEGORY_META, PLACE_CATEGORY_ORDER } from '@/components/places/place-meta';
import { Button } from '@/components/ui/button/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/select';
import { Switch } from '@/components/ui/switch/switch';
import { Textarea } from '@/components/ui/textarea/textarea';

import { api } from '@/services/api';
import type { PlaceCategory, PlaceInput, StaffPlace } from '@/services/api/places';

type LatLng = { lat: number; lng: number };

type PlaceFormProps = {
  /** Set when editing. Without it the form creates a place. */
  place?: StaffPlace;
  /** Where the map opens when there is no pin yet. */
  cityCenter: LatLng;
};

const MAP_OPTIONS: google.maps.MapOptions = { clickableIcons: false, gestureHandling: 'cooperative' };
const FIELD_MAX = 300;

// Empty optional fields are sent as null, so an edit can clear them.
const orNull = (value: string) => value.trim() || null;

export function PlaceForm({ place, cityCenter }: PlaceFormProps) {
  const t = useTranslations('Places.Form');
  const router = useRouter();
  const [name, setName] = useState(place?.name ?? '');
  const [category, setCategory] = useState<PlaceCategory | ''>(place?.category ?? '');
  const [address, setAddress] = useState(place?.address ?? '');
  const [phone, setPhone] = useState(place?.phone ?? '');
  const [hours, setHours] = useState(place?.hours ?? '');
  const [description, setDescription] = useState(place?.description ?? '');
  const [published, setPublished] = useState(place?.published ?? true);
  const [position, setPosition] = useState<LatLng | null>(place ? { lat: place.latitude, lng: place.longitude } : null);
  const [mapCenter] = useState<LatLng>(position ?? cityCenter);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const missing = [
    name.trim().length < 2 ? t('field_name') : null,
    category ? null : t('field_category'),
    position ? null : t('field_position'),
  ].filter((item): item is string => item !== null);
  const canSave = missing.length === 0 && !saving;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSave || !category || !position) {
      return;
    }
    setSaving(true);
    const data: PlaceInput = {
      name: name.trim(),
      category,
      latitude: position.lat,
      longitude: position.lng,
      address: orNull(address),
      phone: orNull(phone),
      hours: orNull(hours),
      description: orNull(description),
      published,
    };
    const response = place ? await api.places.update(place.id, data) : await api.places.create(data);
    setSaving(false);
    if (!response.ok) {
      toast.error(t('save_error'));
      return;
    }
    toast.success(t('saved'));
    router.push('/places');
  };

  const remove = async () => {
    if (!place) {
      return;
    }
    setDeleting(true);
    const response = await api.places.remove(place.id);
    setDeleting(false);
    if (!response.ok) {
      toast.error(t('delete_error'));
      return;
    }
    toast.success(t('deleted'));
    router.push('/places');
  };

  return (
    <>
      <form onSubmit={save} className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="place-name">{t('name')}</Label>
            <Input id="place-name" value={name} maxLength={120} autoComplete="off" onChange={event => setName(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-category">{t('category')}</Label>
            <Select value={category} onValueChange={value => setCategory(value as PlaceCategory)}>
              <SelectTrigger id="place-category" className="h-10 w-full bg-background">
                <SelectValue placeholder={t('category_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {PLACE_CATEGORY_ORDER.map(key => (
                  <SelectItem key={key} value={key}>{CATEGORY_META[key].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-address">{t('address')}</Label>
            <Input id="place-address" value={address} maxLength={FIELD_MAX} onChange={event => setAddress(event.target.value)} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="place-phone">{t('phone')}</Label>
              <Input id="place-phone" type="tel" value={phone} maxLength={FIELD_MAX} onChange={event => setPhone(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place-hours">{t('hours')}</Label>
              <Input
                id="place-hours"
                value={hours}
                maxLength={FIELD_MAX}
                placeholder={t('hours_placeholder')}
                onChange={event => setHours(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-description">{t('description')}</Label>
            <Textarea id="place-description" rows={3} value={description} maxLength={FIELD_MAX} onChange={event => setDescription(event.target.value)} />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <div>
              <Label htmlFor="place-published">{t('published')}</Label>
              <p className="text-sm text-muted-foreground">{t('published_hint')}</p>
            </div>
            <Switch id="place-published" checked={published} onCheckedChange={setPublished} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>{t('position')}</Label>
          <p className="text-sm text-muted-foreground">{t('position_hint')}</p>
          <div className="relative h-[360px] overflow-hidden rounded-2xl border border-border bg-card dark:brightness-[.85]">
            {isLoaded
              ? (
                  <GoogleMaps
                    center={mapCenter}
                    zoom={place ? 16 : 13}
                    options={MAP_OPTIONS}
                    onClick={(event) => {
                      if (event.latLng) {
                        setPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                      }
                    }}
                  >
                    {position && <Marker position={position} />}
                  </GoogleMaps>
                )
              : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                    {loadError ? t('map_error') : t('map_loading')}
                  </div>
                )}
          </div>
          <p className="text-sm tabular-nums text-muted-foreground">
            {position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : t('no_position')}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/places">{t('back')}</Link>
            </Button>
            {place && (
              <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 aria-hidden="true" />
                {t('delete')}
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button type="submit" disabled={!canSave}>{saving ? t('saving') : t('save')}</Button>
            {missing.length > 0 && <p className="text-sm text-muted-foreground">{t('missing', { items: missing.join(', ') })}</p>}
          </div>
        </div>
      </form>

      {place && (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('delete_title')}</DialogTitle>
              <DialogDescription>{t('delete_description')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>{t('cancel')}</Button>
              <Button variant="destructive" disabled={deleting} onClick={remove}>{t('delete')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
