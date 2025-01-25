import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Separator } from '@/components/ui/separator/separator';

import type { IssueDetails } from '@/types/Issue';

type IssueHistoryDetailsProps = {
  issue: IssueDetails;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const IssueHistoryDetails = ({ issue, open, setOpen }: IssueHistoryDetailsProps) => {
  const t = useTranslations('Issues');

  return (
    <Dialog open={open}>
      <DialogContent showClose={false}>
        <DialogHeader className="flex gap-4">
          <DialogTitle>{t('AccessPage.history')}</DialogTitle>
          <DialogDescription className="max-h-[50vh] overflow-y-auto !text-left">
            {issue.history.map((history, index) => (
              <div key={history.id} className={cn('flex flex-col gap-2', index > 0 && 'mt-2')}>
                <div className="flex flex-row gap-2">
                  <span>
                    {dayjs(history.updatedAt).format('DD/MM/YYYY HH:mm')}
                  </span>
                  <span className="italic">
                    {t(`actions.${history.action}`, {
                      userName: history.userName,
                    })}
                  </span>
                </div>

                {!!history.description && (
                  <div className="flex flex-row gap-2">
                    <span>
                      {t('AccessPage.description')}
                      :
                    </span>
                    <span className="italic">
                      {history.description}
                    </span>
                  </div>
                )}

                <Separator />
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 flex flex-row justify-end gap-4">
          <DialogClose asChild onClick={() => setOpen(false)}>
            <Button>{t('AccessPage.history_close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
