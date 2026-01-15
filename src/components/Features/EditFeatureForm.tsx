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

import { editFeatureSchema } from '@/schemas/feature/edit.schema';
import { api } from '@/services/api';
import { slugify, unslugify } from '@/utils/slugify';

import type { FeatureFlag } from '@/types/FeatureFlag';

export type EditFeatureFormData = {
  name: string;
  description: string;
  slug: string;
  id: string;
};

export default function EditFeatureForm({ feature }: { feature: FeatureFlag }) {
  const router = useRouter();
  const t = useTranslations('Features.EditPage');
  const formSchema = editFeatureSchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<EditFeatureFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      ...feature,
      name: unslugify(feature.slug),
      description: feature.description,
      slug: feature.slug,
    },
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const handleSubmit = async (data: EditFeatureFormData) => {
    try {
      const response = await api.ff.update({
        name: data.name,
        description: data.description,
        slug: slugify(data.name),
        id: data.id,
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
        <Card className="w-full max-w-3xl border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label htmlFor="feature-name">{t('feature_name')}</Label>
                <p className="text-xs text-muted-foreground">{t('feature_name_placeholder')}</p>
                <Input id="feature-name" type="text" placeholder={t('feature_name_placeholder')} required {...register('name')} />
                {methods.formState.errors.name && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.name.message}</span>}

                <span className="text-xs text-muted-foreground">
                  slug:
                  {' '}
                  {slugify(methods.watch('name'))}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label htmlFor="feature-description">{t('feature_description')}</Label>
                <p className="text-xs text-muted-foreground">{t('feature_description_placeholder')}</p>
                <Textarea id="feature-description" placeholder={t('feature_description_placeholder')} required {...register('description')} />
                {methods.formState.errors.description && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.description.message}</span>}
              </div>
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
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
