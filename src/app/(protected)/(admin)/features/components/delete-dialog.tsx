import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';

import { api } from '@/services/api';
import { mutate } from '@/utils/revalidateTag';
import { unslugify } from '@/utils/slugify';

import type { FeatureFlag } from '@/types/FeatureFlag';

type DeleteFeatureDialogProps = {
  feature: FeatureFlag | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DeleteFeatureDialog = ({ feature, open, setOpen }: DeleteFeatureDialogProps) => {
  const t = useTranslations('Features.table');

  const handleDeleteFeature = async () => {
    try {
      const response = await api.ff.deleteById(feature?.id ?? '');

      if (!response.ok) {
        throw new Error(t('delete_error'));
      }

      toast.success(t('delete_success'));
      mutate('list-features');
      setOpen(false);
    } catch {
      toast.error(t('delete_error'));
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent showClose={false}>
        <DialogHeader className="flex gap-4">
          <DialogTitle>{t('confirm_delete_title')}</DialogTitle>
          <DialogDescription>
            {t.rich('confirm_delete_description', {
              bold: chunks => <b>{chunks}</b>,
              featureName: unslugify(feature?.slug ?? ''),
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 flex flex-row !justify-between gap-4">
          <DialogClose asChild onClick={() => setOpen(false)}>
            <Button>{t('cancel_delete')}</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDeleteFeature}>{t('delete')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
