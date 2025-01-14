'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Textarea } from '@/components/ui/textarea/textarea';

import { createFeatureSchema } from '@/schemas/feature/create.schema';
import { api } from '@/services/api';
import { slugify } from '@/utils/slugify';

export type FeatureFormData = {
  name: string;
  description: string;
  slug: string;
};

export default function FeatureForm() {
  const router = useRouter();
  const t = useTranslations('Features.CreatePage');
  const formSchema = createFeatureSchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<FeatureFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      slug: '',
    },
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const handleSubmit = async (data: FeatureFormData) => {
    try {
      const response = await api.ff.create({
        name: data.name,
        description: data.description,
        slug: slugify(data.name),
      });

      if (!response.ok) {
        throw new Error(t('error'));
      }

      toast.success(t('success'));
      router.push('/features');
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
              <Label htmlFor="feature-name">{t('feature_name')}</Label>
              <Input id="feature-name" type="text" placeholder={t('feature_name_placeholder')} required {...register('name')} />
              {methods.formState.errors.name && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.name.message}</span>}

              <span>
                slug:
                {' '}
                {slugify(methods.watch('name'))}
              </span>
            </div>

            <div className="relative grid gap-2">
              <Label htmlFor="feature-description">{t('feature_description')}</Label>
              <Textarea id="feature-description" placeholder={t('feature_description_placeholder')} required {...register('description')} />
              {methods.formState.errors.description && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.description.message}</span>}
            </div>

          </CardContent>
          <CardFooter className="w-full">
            <div className="flex flex-1 justify-between gap-2">
              <Button asChild type="button" variant="outline">
                <Link href="/features">
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
