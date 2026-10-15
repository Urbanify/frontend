'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import type { Viewer } from '@/components/app/use-viewer';
import { Button } from '@/components/ui/button/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog/dialog';
import { Label } from '@/components/ui/label/label';
import { Textarea } from '@/components/ui/textarea/textarea';

import { api } from '@/services/api';
import { mutate } from '@/utils/revalidateTag';

import type { IssueDetails, IssueHistory, IssueHistoryAction } from '@/types/Issue';

type AssignBannerProps = {
  issue: IssueDetails;
  viewer: Viewer;
  className?: string;
};

type DialogKind = 'verify' | 'resolve' | 'confirm';
type NextAction = 'assignFiscal' | 'assignManager' | DialogKind;

type DialogProps = {
  issue: IssueDetails;
  onDismiss: () => void;
  onDone: () => void;
};

type Messages = { loading: string; success: string; error: string };

// Toast + result. The API returns a Response even on 4xx/5xx, so the ok flag decides the outcome.
async function send(request: Promise<Response>, messages: Messages): Promise<boolean> {
  const outcome = request.then((response) => {
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
  });
  toast.promise(outcome, messages);
  try {
    await outcome;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function latest(history: IssueHistory[], action: IssueHistoryAction) {
  return history
    .filter(entry => entry.action === action)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .at(-1);
}

// "Próximo passo": one sentence saying what happens now, and at most one primary button.
// Who can do what is the same rule set as before (reporter / verifier / manager / status).
export function AssignBanner({ issue, viewer, className }: AssignBannerProps) {
  const t = useTranslations('IssueDetail.nextStep');
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { status } = issue;
  const isReporter = issue.reporterId === viewer.id;
  const isFiscal = issue.fiscalId === viewer.id;
  const isTheManager = issue.managerId === viewer.id;

  const solvedAt = latest(issue.history, 'MARKED_AS_SOLVED')?.createdAt ?? issue.updatedAt;
  const closing = latest(issue.history, 'MARKED_AS_UNFOUNDED');

  const statusText = () => {
    switch (status) {
      case 'WAITING_FOR_FISCAL':
        return t('waitingVerifier');
      case 'WAITING_FOR_PROCEDURE':
        return t('inVerification');
      case 'WAITING_FOR_MANAGER':
        return t('queued');
      case 'WAITING_FOR_MANAGER_RESOLUTION':
        return t('inProgress');
      case 'WAITING_FOR_RESOLUTION_VALIDATION':
        return t('awaitingCitizen');
      case 'SOLVED':
        return t('solvedOn', { date: dayjs(solvedAt).format('DD/MM') });
      case 'CLOSED':
        return closing?.description
          ? t('closedBecause', { reason: closing.description.trim().replace(/[.!?]+$/, '') })
          : t('closed');
    }
  };

  let text = statusText();
  let action: NextAction | undefined;

  if (viewer.role === 'RESIDENT' && !isReporter && status === 'WAITING_FOR_FISCAL' && !issue.fiscalId) {
    text = t('noVerifier');
    action = 'assignFiscal';
  } else if (viewer.role === 'MANAGER' && !isReporter && status === 'WAITING_FOR_MANAGER' && !issue.managerId) {
    // Owners never see this button: the API does not give them the manager role on assign.
    text = t('queued');
    action = 'assignManager';
  } else if (isFiscal && status === 'WAITING_FOR_PROCEDURE') {
    text = t('verifyOnSite');
    action = 'verify';
  } else if (isTheManager && status === 'WAITING_FOR_MANAGER_RESOLUTION') {
    text = t('managing');
    action = 'resolve';
  } else if ((isReporter || isFiscal) && status === 'WAITING_FOR_RESOLUTION_VALIDATION') {
    text = t('confirmNeeded');
    action = 'confirm';
  }

  const handleAssign = async () => {
    setIsAssigning(true);
    const ok = await send(api.issues.assignMe(issue.id), {
      loading: t('assigning'),
      success: t('assigned'),
      error: t('assignFailed'),
    });
    setIsAssigning(false);
    if (ok) {
      mutate(`get-issue-${issue.id}`);
    }
  };

  const finish = () => {
    setDialog(null);
    mutate(`get-issue-${issue.id}`);
  };

  return (
    <section aria-labelledby="next-step-title" className={cn('rounded-lg border border-border bg-card p-5', className)}>
      <h2 id="next-step-title" className="text-sm font-semibold text-navy">{t('title')}</h2>
      <p className="mt-2 text-base text-foreground">{text}</p>

      {action && (
        <Button
          className="mt-4 w-full sm:w-auto"
          isLoading={isAssigning}
          onClick={() => {
            if (action === 'assignFiscal' || action === 'assignManager') {
              handleAssign();
            } else {
              setDialog(action);
            }
          }}
        >
          {t(`buttons.${action}`)}
        </Button>
      )}

      {dialog === 'verify' && <VerifyDialog issue={issue} onDismiss={() => setDialog(null)} onDone={finish} />}
      {dialog === 'resolve' && <ResolveDialog issue={issue} onDismiss={() => setDialog(null)} onDone={finish} />}
      {dialog === 'confirm' && <ConfirmDialog issue={issue} onDismiss={() => setDialog(null)} onDone={finish} />}
    </section>
  );
}

// Fiscal on site: "existe" confirms (accept), "não encontrei" closes as unfounded (close).
function VerifyDialog({ issue, onDismiss, onDone }: DialogProps) {
  const t = useTranslations('IssueDetail.verify');
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const trimmed = comment.trim();

  const submit = async (exists: boolean) => {
    setIsSending(true);
    const request = exists
      ? api.issues.accept(issue.id, trimmed || t('defaultComment'))
      : api.issues.close(issue.id, trimmed);
    const ok = await send(request, { loading: t('saving'), success: t('saved'), error: t('failed') });
    setIsSending(false);
    if (ok) {
      onDone();
    }
  };

  return (
    <Dialog open onOpenChange={open => !open && onDismiss()}>
      <DialogContent className="w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label htmlFor="verify-comment">{t('label')}</Label>
          <Textarea id="verify-comment" rows={4} value={comment} onChange={event => setComment(event.target.value)} />
          <p className="text-sm text-muted-foreground">{t('hint')}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button className="h-14 text-base md:h-14" disabled={isSending} onClick={() => submit(true)}>
            {t('exists')}
          </Button>
          <Button className="h-14 text-base md:h-14" variant="outline" disabled={!trimmed || isSending} onClick={() => submit(false)}>
            {t('notFound')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Manager registers what was done on the site. Required.
function ResolveDialog({ issue, onDismiss, onDone }: DialogProps) {
  const t = useTranslations('IssueDetail.resolve');
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const trimmed = text.trim();

  const submit = async () => {
    setIsSending(true);
    const ok = await send(api.issues.resolution(issue.id, trimmed), {
      loading: t('saving'),
      success: t('saved'),
      error: t('failed'),
    });
    setIsSending(false);
    if (ok) {
      onDone();
    }
  };

  return (
    <Dialog open onOpenChange={open => !open && onDismiss()}>
      <DialogContent className="w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label htmlFor="resolution-text">{t('label')}</Label>
          <Textarea id="resolution-text" rows={5} value={text} onChange={event => setText(event.target.value)} />
          <p className="text-sm text-muted-foreground">{t('hint')}</p>
        </div>

        <Button className="w-full" disabled={!trimmed || isSending} onClick={submit}>
          {t('submit')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Reporter or verifier confirms the solution (solve) or asks for a new one (askNewSolution, reason required).
function ConfirmDialog({ issue, onDismiss, onDone }: DialogProps) {
  const t = useTranslations('IssueDetail.confirm');
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const trimmed = text.trim();
  const lastSolution = latest(issue.history, 'ADDED_RESOLUTION')?.description;

  const submit = async (resolved: boolean) => {
    setIsSending(true);
    const request = resolved
      ? api.issues.solve(issue.id, trimmed)
      : api.issues.askNewSolution(issue.id, trimmed);
    const ok = await send(request, { loading: t('saving'), success: t('saved'), error: t('failed') });
    setIsSending(false);
    if (ok) {
      onDone();
    }
  };

  return (
    <Dialog open onOpenChange={open => !open && onDismiss()}>
      <DialogContent className="w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2">
          <p className="text-sm font-medium text-foreground">{t('lastSolution')}</p>
          <p className="whitespace-pre-line rounded-md bg-muted p-3 text-base text-foreground">
            {lastSolution || t('noSolution')}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-text">{t('label')}</Label>
          <Textarea id="confirm-text" rows={3} value={text} onChange={event => setText(event.target.value)} />
          <p className="text-sm text-muted-foreground">{t('hint')}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button disabled={isSending} onClick={() => submit(true)}>
            {t('yes')}
          </Button>
          <Button variant="outline" disabled={!trimmed || isSending} onClick={() => submit(false)}>
            {t('no')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
