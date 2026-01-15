'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import BannerMessage from '@/components/banner/banner';
import { Button } from '@/components/ui/button/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog/dialog';
import { Label } from '@/components/ui/label/label';
import { Textarea } from '@/components/ui/textarea/textarea';

import { takeActionIssueSchema } from '@/schemas/issues/action.schema';
import { api } from '@/services/api';
import { parseJwt } from '@/utils/decodeJWT';
import { mutate } from '@/utils/revalidateTag';

import type { IssueDetails } from '@/types/Issue';

type AssignBannerProps = {
  issue: IssueDetails;
};

type IssueActionData = {
  description: string;
};

export default function AssignBanner({ issue }: AssignBannerProps) {
  const { data } = useSession();
  const t = useTranslations('Issues.AccessPage');
  const parsedJWT = parseJwt(data?.access_token);
  const actionTranslation = useTranslations('Issues.ReportPage');
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const formSchema = takeActionIssueSchema(actionTranslation as unknown as (arg: string) => string);
  const { register, ...methods } = useForm<IssueActionData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      description: '',
    },
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const actionForm = () => {
    return (
      <FormProvider {...methods} register={register}>
        <div className="relative grid gap-2">
          <Label htmlFor="issue_description">{t('add_a_comment')}</Label>
          <Textarea id="issue_description" placeholder={t('add_a_comment_placeholder')} required {...register('description')} />
          {methods.formState.errors.description && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.description.message}</span>}
        </div>
      </FormProvider>
    );
  };

  if (!parsedJWT) {
    return null;
  }

  const { role, id } = parsedJWT?.user;
  const isReporter = issue.reporterId === id;
  const isFiscal = issue.fiscalId === id;
  const isTheManager = issue.managerId === id;
  const isResident = role === 'RESIDENT';
  const isAManager = role === 'MANAGER' || role === 'OWNER';

  const handleAssignMe = async () => {
    await toast.promise(
      api.issues.assignMe(issue.id),
      {
        loading: t('assigning'),
        success: () => {
          mutate(`get-issue-${issue.id}`);
          return t('assign_success');
        },
        error: () => {
          mutate(`get-issue-${issue.id}`);
          return t('assign_error');
        },
      },
    );
  };

  const closeDialog = () => {
    mutate(`get-issue-${issue.id}`);
    setIsLoading(false);
    setOpen(false);
  };

  const handleAddIssueResolution = async () => {
    setIsLoading(true);
    await toast.promise(
      api.issues.resolution(issue.id, methods.getValues().description),
      {
        loading: t('adding_resolution'),
        success: () => {
          closeDialog();
          return t('resolution_success');
        },
        error: () => {
          closeDialog();
          return t('resolution_error');
        },
      },
    );
  };

  const handleAcceptIssue = async () => {
    setIsLoading(true);
    await toast.promise(
      api.issues.accept(issue.id, methods.getValues().description),
      {
        loading: t('confirming_accept'),
        success: () => {
          closeDialog();
          return t('accept_success');
        },
        error: () => {
          closeDialog();
          return t('accept_error');
        },
      },
    );
  };

  const handleCloseIssue = async () => {
    setIsLoading(true);
    await toast.promise(
      api.issues.close(issue.id, methods.getValues().description),
      {
        loading: t('confirming_close'),
        success: () => {
          closeDialog();
          return t('close_success');
        },
        error: () => {
          closeDialog();
          return t('close_error');
        },
      },
    );
  };

  const handleSolve = async () => {
    setIsLoading(true);
    await toast.promise(
      api.issues.solve(issue.id, methods.getValues().description),
      {
        loading: t('accepting_resolution'),
        success: () => {
          closeDialog();
          return t('accepting_resolution_success');
        },
        error: () => {
          closeDialog();
          return t('accepting_resolution_error');
        },
      },
    );
  };

  const handleDoesNotSolve = async () => {
    setIsLoading(true);
    await toast.promise(
      api.issues.askNewSolution(issue.id, methods.getValues().description),
      {
        loading: t('asking_new_resolution'),
        success: () => {
          closeDialog();
          return t('ask_new_resolution_success');
        },
        error: () => {
          closeDialog();
          return t('ask_new_resolution_error');
        },
      },
    );
  };

  if (isResident && !isReporter && !issue.fiscalId) {
    return <BannerMessage message={t('no_fiscal_yet')} onClick={handleAssignMe} />;
  }

  if (isAManager && !isReporter && !issue.managerId && issue.status !== 'WAITING_FOR_MANAGER') {
    return <BannerMessage message={t('cant_assign_yet')} />;
  }

  if (isAManager && !isReporter && !issue.managerId && issue.status === 'WAITING_FOR_MANAGER') {
    return <BannerMessage message={t('no_manager_yet')} onClick={handleAssignMe} />;
  }

  if (isFiscal && issue.status === 'WAITING_FOR_PROCEDURE') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <BannerMessage message={t('issue_needs_validation')} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('should_proceed')}</DialogTitle>
            <DialogDescription className="!mt-3 text-sm text-muted-foreground">
              {t('should_proceed_info')}
            </DialogDescription>

            <div className="!mt-12 w-full !text-left">
              {actionForm()}
            </div>
          </DialogHeader>
          <DialogFooter className="mt-8 flex-row !justify-between gap-4">
            <Button
              isLoading={isLoading}
              disabled={disableButton}
              onClick={handleCloseIssue}
              variant="destructive"
            >
              {t('close_issue')}
            </Button>
            <Button
              isLoading={isLoading}
              disabled={disableButton}
              onClick={handleAcceptIssue}
            >
              {t('validate_issue')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isTheManager && issue.status === 'WAITING_FOR_MANAGER_RESOLUTION') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <BannerMessage message={t('issue_needs_validation')} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('waiting_for_resolution')}</DialogTitle>
            <DialogDescription className="!mt-3 text-sm text-muted-foreground">
              {t('waiting_for_resolution_info')}
            </DialogDescription>
            <DialogDescription className="!mt-3 text-sm text-muted-foreground">
              {t('waiting_for_resolution_disclaimer')}
            </DialogDescription>

            <div className="!mt-12 w-full !text-left">
              {actionForm()}
            </div>
          </DialogHeader>
          <DialogFooter className="mt-8 flex-row !justify-between gap-4">
            <Button
              isLoading={isLoading}
              disabled={disableButton}
              onClick={handleCloseIssue}
              variant="destructive"
            >
              {t('close_issue')}
            </Button>
            <Button
              isLoading={isLoading}
              disabled={disableButton}
              onClick={handleAddIssueResolution}
            >
              {t('add_resolution')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if ((isFiscal || isReporter || isTheManager) && issue.status === 'WAITING_FOR_RESOLUTION_VALIDATION') {
    const lastSolution = issue.history?.filter(history => history.action === 'ADDED_RESOLUTION').reverse()[0];

    const lastCreatedAt = lastSolution?.createdAt;

    const sevenDaysLater = dayjs(lastCreatedAt).add(7, 'day');
    const now = dayjs();

    const totalHoursRemaining = sevenDaysLater.diff(now, 'hour');
    const daysRemaining = Math.floor(totalHoursRemaining / 24);
    const hoursRemaining = totalHoursRemaining % 24;

    const disableManagerSolve = totalHoursRemaining > 0;

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <BannerMessage message={t('validate_resolution')} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('is_resolution_valid')}</DialogTitle>
            <DialogDescription className="!mt-3 text-sm text-muted-foreground">
              {t('is_resolution_valid_info')}
            </DialogDescription>

            <div className="!mt-12 w-full !text-left">
              <div className="relative grid gap-2">
                <Label htmlFor="resolution">{t('last_resolution')}</Label>
                <Textarea id="resolution" className="pointer-events-none resize-none" defaultValue={lastSolution?.description} />
              </div>
            </div>

            <div className="!mt-12 w-full !text-left">
              {actionForm()}
            </div>
          </DialogHeader>
          <DialogFooter className={cn('mt-8 flex-row !justify-between gap-4', isTheManager && '!justify-end')}>
            {!isTheManager && (
              <Button
                isLoading={isLoading}
                disabled={disableButton}
                onClick={handleDoesNotSolve}
                variant="destructive"
              >
                {t('does_not_solve')}
              </Button>
            )}
            {!isTheManager
            && (
              <Button
                isLoading={isLoading}
                disabled={disableButton}
                onClick={handleSolve}
              >
                {t('it_does_solve')}
              </Button>
            )}

            {isTheManager && (
              <div className="flex flex-col items-end gap-2 text-center">
                <Button
                  className="w-fit"
                  isLoading={isLoading}
                  disabled={disableButton || disableManagerSolve}
                  onClick={(disableButton || disableManagerSolve) ? () => ({}) : handleSolve}
                >
                  {t('it_does_solve')}
                </Button>

                <small className="text-xs text-muted-foreground">
                  {t('close_after_7days', {
                    days: daysRemaining,
                    hours: hoursRemaining,
                  })}
                </small>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
