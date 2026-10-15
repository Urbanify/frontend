'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import type { Viewer } from '@/components/app/use-viewer';
import { Button } from '@/components/ui/button/button';
import { Label } from '@/components/ui/label/label';
import { Textarea } from '@/components/ui/textarea/textarea';

import { api } from '@/services/api';

import type { IssueDetails } from '@/types/Issue';

type CommentRole = 'reporter' | 'fiscal' | 'manager' | 'resident';

type IssueComment = {
  id: string;
  authorId: string;
  name: string;
  role: CommentRole;
  text: string;
  createdAt: string;
  replies: IssueComment[];
};

type ApiComment = {
  id: string;
  text: string;
  authorId: string;
  parentId: string | null;
  createdAt: string;
  author?: { name: string; surname: string };
};

type IssueCommentsProps = {
  issue: IssueDetails;
  viewer: Viewer;
  className?: string;
};

const byDate = (a: IssueComment, b: IssueComment) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

// Closed by default: the composer only opens on "Escrever comentário". The list stays visible.
export function IssueComments({ issue, viewer, className }: IssueCommentsProps) {
  const t = useTranslations('IssueDetail.conversation');
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const roleOf = (userId: string): CommentRole => {
    if (userId === issue.reporterId) {
      return 'reporter';
    }
    if (userId === issue.fiscalId) {
      return 'fiscal';
    }
    if (userId === issue.managerId) {
      return 'manager';
    }
    return 'resident';
  };

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await api.comments.list({ issueId: issue.id, page: 1, take: 20 });
      const data = response.ok ? await response.json().catch(() => null) : null;
      const items: ApiComment[] = Array.isArray(data?.items) ? data.items : [];

      const byId = new Map<string, IssueComment>();
      items.forEach((item) => {
        byId.set(item.id, {
          id: item.id,
          authorId: item.authorId,
          name: item.author ? `${item.author.name} ${item.author.surname}`.trim() : t('unknownAuthor'),
          role: roleOf(item.authorId),
          text: item.text,
          createdAt: item.createdAt,
          replies: [],
        });
      });

      const roots: IssueComment[] = [];
      items.forEach((item) => {
        const comment = byId.get(item.id);
        if (!comment) {
          return;
        }
        const parent = item.parentId ? byId.get(item.parentId) : undefined;
        if (parent) {
          parent.replies.push(comment);
        } else {
          roots.push(comment);
        }
      });

      roots.sort((a, b) => byDate(b, a));
      roots.forEach(comment => comment.replies.sort(byDate));
      setComments(roots);
    } catch (error) {
      console.error(error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewer.token) {
      loadComments();
    }
  }, [issue.id, viewer.token]);

  const closeComposer = () => {
    setIsWriting(false);
    setText('');
  };

  const closeReply = () => {
    setReplyTo(null);
    setReplyText('');
  };

  const send = async (request: () => Promise<Response>, onSent: () => void) => {
    setIsSending(true);
    try {
      const response = await request();
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      onSent();
      await loadComments();
    } catch (error) {
      console.error(error);
      toast.error(t('failed'));
    } finally {
      setIsSending(false);
    }
  };

  const handleCreate = () => send(
    () => api.comments.create({ text: text.trim(), issueId: issue.id, cityId: issue.cityId }),
    () => {
      setText('');
      setIsWriting(false);
    },
  );

  const handleReply = (parentId: string) => send(
    () => api.comments.reply(parentId, { text: replyText.trim(), issueId: issue.id, cityId: issue.cityId }),
    () => {
      setReplyText('');
      setReplyTo(null);
    },
  );

  const handleDelete = (commentId: string) => send(
    () => api.comments.deleteById(commentId),
    () => {},
  );

  const renderItem = (comment: IssueComment, isReply: boolean) => {
    const isMine = comment.authorId === viewer.id;
    const displayName = viewer.audience === 'citizen' && comment.role === 'reporter' ? t('citizen') : comment.name;

    return (
      <article className={cn(isReply ? 'space-y-1' : 'space-y-2')}>
        <header className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {t(`roles.${comment.role}`)}
          </span>
          <time className="text-xs tabular-nums text-muted-foreground" dateTime={comment.createdAt}>
            {dayjs(comment.createdAt).format('DD/MM/YYYY HH:mm')}
          </time>
        </header>
        <p className="whitespace-pre-line text-base text-foreground">{comment.text}</p>
        <div className="flex items-center gap-4 text-sm">
          {!isReply && (
            <button type="button" className="text-muted-foreground transition-colors hover:text-foreground" onClick={() => setReplyTo(comment.id)}>
              {t('reply')}
            </button>
          )}
          {isMine && (
            <button type="button" className="text-muted-foreground transition-colors hover:text-foreground" onClick={() => handleDelete(comment.id)}>
              {t('delete')}
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className={cn('rounded-lg border border-border bg-card p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-navy">
          {t('title')}
          {' '}
          <span className="font-normal tabular-nums text-muted-foreground">{comments.length}</span>
        </h2>
        {!isWriting && (
          <Button variant="outline" size="sm" onClick={() => setIsWriting(true)}>
            {t('write')}
          </Button>
        )}
      </div>

      {isWriting && (
        <div className="mt-4 grid gap-2">
          <Label htmlFor="issue-comment">{t('label')}</Label>
          <Textarea
            id="issue-comment"
            rows={3}
            placeholder={t('placeholder')}
            value={text}
            onChange={event => setText(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={closeComposer}
            >
              {t('cancel')}
            </Button>
            <Button disabled={!text.trim() || isSending} onClick={handleCreate}>
              {t('send')}
            </Button>
          </div>
        </div>
      )}

      {!isLoading && comments.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">{t('empty')}</p>
      )}

      {comments.length > 0 && (
        <ul className="mt-5 space-y-5">
          {comments.map(comment => (
            <li key={comment.id} className="space-y-3">
              {renderItem(comment, false)}

              {comment.replies.length > 0 && (
                <ul className="space-y-3 border-l border-border pl-4">
                  {comment.replies.map(reply => (
                    <li key={reply.id}>{renderItem(reply, true)}</li>
                  ))}
                </ul>
              )}

              {replyTo === comment.id && (
                <div className="grid gap-2 rounded-md bg-background p-3">
                  <Label htmlFor={`reply-${comment.id}`}>{t('replyLabel')}</Label>
                  <Textarea
                    id={`reply-${comment.id}`}
                    rows={2}
                    value={replyText}
                    onChange={event => setReplyText(event.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeReply}
                    >
                      {t('cancel')}
                    </Button>
                    <Button size="sm" disabled={!replyText.trim() || isSending} onClick={() => handleReply(comment.id)}>
                      {t('sendReply')}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
