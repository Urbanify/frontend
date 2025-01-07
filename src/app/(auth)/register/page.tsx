import Link from 'next/link';

import { loadCities } from '@/lib/loaders/loadCities';

import { RegisterForm } from '@/components/Auth/register-form';

export default async function RegisterPage() {
  const cities = await loadCities();
  const citiesOptions = cities?.map(city => ({
    value: city.id,
    label: city.name,
  }));

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            {/* <GalleryVerticalEnd className="size-4" /> */}
            LOGO
          </div>
          Fixed My City
        </Link>
        <RegisterForm cities={citiesOptions} />
      </div>
    </div>
  );
}
