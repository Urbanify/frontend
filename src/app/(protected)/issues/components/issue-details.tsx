'use client';
import { Marker, useLoadScript } from '@react-google-maps/api';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { SquareAd } from '@/components/ui/ads/square';
import { Avatar, AvatarFallback } from '@/components/ui/avatar/avatar';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel/carousel';
import { Label } from '@/components/ui/label/label';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { Textarea } from '@/components/ui/textarea/textarea';

import { useAd } from '@/contexts/ads/useAd';
import { api } from '@/services/api';
import { parseJwt } from '@/utils/decodeJWT';

import { IssueHistoryDetails } from './issue-history-details';
import IssueStatusBadge from './issue-status-badge';

import type { IssueDetails } from '@/types/Issue';
import { issueCategories } from '@/types/Issue';

type IssuesTableProps = {
  issue: IssueDetails;
};

type CommentRole = 'reporter' | 'fiscal' | 'manager' | 'resident';

type CommentUser = {
  id: string;
  name: string;
  role: CommentRole;
};

type IssueComment = {
  id: string;
  user: CommentUser;
  text: string;
  createdAt: string;
  replies?: IssueComment[];
};

type ApiComment = {
  id: string;
  text: string;
  issueId: string;
  cityId: string;
  authorId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    surname: string;
    email: string;
    cityId: string;
    role: string;
  };
};

export function IssueDetailment({ issue }: IssuesTableProps) {
  const { currentAd } = useAd();
  const { data: session } = useSession();
  const [openHistory, setOpenHistory] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const t = useTranslations('Issues');
  const commentsT = useTranslations('Issues.Comments');
  const parsedJWT = parseJwt(session?.access_token);

  const getOptionIcon = (value: string) => {
    return issueCategories.find(option => option.value === value)?.icon;
  };
  const getCategoryVariant = (category: IssueDetails['category']) => {
    switch (category) {
      case 'INFRASTRUCTURE':
        return 'warning';
      case 'ENVIRONMENT':
        return 'success';
      case 'TRANSPORTATION':
        return 'info';
      case 'SAFETY':
        return 'danger';
      case 'COMUNITY':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const resolveRole = (userId: string): CommentRole => {
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

  const roleLabel = (role: CommentRole) => {
    return commentsT(`roles.${role}`);
  };

  const roleVariant = (role: CommentRole) => {
    switch (role) {
      case 'reporter':
        return 'info';
      case 'fiscal':
        return 'warning';
      case 'manager':
        return 'success';
      case 'resident':
      default:
        return 'secondary';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    const initials = parts.slice(0, 2).map(part => part[0]).join('');
    return initials.toUpperCase();
  };

  const mapApiComments = (items: ApiComment[]): IssueComment[] => {
    const byId = new Map<string, IssueComment>();

    items.forEach((item) => {
      const name = item.author
        ? `${item.author.name} ${item.author.surname}`.trim()
        : commentsT('unknown_author');
      const userId = item.authorId ?? item.author?.id ?? 'unknown';

      byId.set(item.id, {
        id: item.id,
        user: {
          id: userId,
          name,
          role: resolveRole(userId),
        },
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
      if (item.parentId && byId.has(item.parentId)) {
        const parent = byId.get(item.parentId);
        parent?.replies?.push(comment);
      } else {
        roots.push(comment);
      }
    });

    const sortByDate = (a: IssueComment, b: IssueComment) => (
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    roots.sort((a, b) => sortByDate(b, a));
    roots.forEach((comment) => {
      if (comment.replies?.length) {
        comment.replies.sort(sortByDate);
      }
    });

    return roots;
  };

  const [comments, setComments] = useState<IssueComment[]>([]);

  const currentUserId = parsedJWT?.user?.id ?? 'current-user';

  const loadComments = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!session?.access_token) {
      setComments([]);
      return;
    }

    if (!silent) {
      setIsLoadingComments(true);
    }

    try {
      const response = await api.comments.list({
        issueId: issue.id,
        page: 1,
        take: 20,
      });

      if (!response.ok) {
        setComments([]);
        return;
      }

      const data = await response.json().catch(() => null);
      const items = Array.isArray(data?.items) ? data.items : [];
      setComments(mapApiComments(items));
    } catch (error) {
      console.error(error);
      setComments([]);
    } finally {
      if (!silent) {
        setIsLoadingComments(false);
      }
    }
  };

  useEffect(() => {
    loadComments().catch(() => null);
  }, [issue.id, session?.access_token]);

  const buildCommentFromResponse = (data: any, fallbackText: string): IssueComment | null => {
    const serverId = data?.id ?? data?.comment?.id ?? data?.reply?.id;
    if (!serverId) {
      return null;
    }
    const authorName = data?.author
      ? `${data.author.name} ${data.author.surname}`.trim()
      : commentsT('unknown_author');
    const authorId = data?.authorId ?? data?.author?.id ?? 'unknown';

    return {
      id: serverId,
      user: {
        id: authorId,
        name: authorName,
        role: resolveRole(authorId),
      },
      text: data?.text ?? data?.comment?.text ?? data?.reply?.text ?? fallbackText,
      createdAt: data?.createdAt ?? new Date().toISOString(),
    };
  };

  const handleCreateComment = async () => {
    if (!commentText.trim()) {
      return;
    }
    if (!session?.access_token) {
      return;
    }
    setIsSubmittingComment(true);

    try {
      const response = await api.comments.create({
        text: commentText.trim(),
        issueId: issue.id,
        cityId: issue.cityId,
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json().catch(() => null);
      const newComment = buildCommentFromResponse(data, commentText.trim());
      if (newComment) {
        setComments(prev => [newComment, ...prev]);
      } else {
        await loadComments({ silent: true });
      }
      setCommentText('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyText.trim()) {
      return;
    }
    if (!session?.access_token) {
      return;
    }
    setSubmittingReplyId(parentId);

    try {
      const response = await api.comments.reply(parentId, {
        text: replyText.trim(),
        issueId: issue.id,
        cityId: issue.cityId,
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json().catch(() => null);
      const reply = buildCommentFromResponse(data, replyText.trim());
      if (reply) {
        setComments(prev => prev.map((comment) => {
          if (comment.id !== parentId) {
            return comment;
          }
          return {
            ...comment,
            replies: [...(comment.replies ?? []), reply],
          };
        }));
      } else {
        await loadComments({ silent: true });
      }
      setReplyText('');
      setActiveReplyId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingReplyId(null);
    }
  };

  const handleDelete = async (commentId: string, parentId?: string) => {
    if (session?.access_token) {
      try {
        await api.comments.deleteById(commentId);
        setComments(prev => prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies?.filter(reply => reply.id !== commentId),
            };
          }
          return comment;
        }).filter(comment => comment.id !== commentId));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const position: google.maps.LatLngLiteral = {
    lat: +issue.latitude,
    lng: +issue.longitude,
  };

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <IssueHistoryDetails issue={issue} open={openHistory} setOpen={setOpenHistory} />
      <Card className="w-full border-border/60 bg-card shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl md:text-2xl">
                {t(`types.${issue.category}`)}
                {' - '}
                {t(`types.${issue.type}`)}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getCategoryVariant(issue.category)} className="gap-2">
                  {(() => {
                    const Icon = getOptionIcon(issue.category);
                    return Icon ? <Icon className="size-3.5" /> : null;
                  })()}
                  {t(`types.${issue.category}`)}
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  {(() => {
                    const Icon = getOptionIcon(issue.type);
                    return Icon ? <Icon className="size-3.5" /> : null;
                  })()}
                  {t(`types.${issue.type}`)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IssueStatusBadge status={issue.status} />
              <Button size="sm" onClick={() => setOpenHistory(true)}>{t('AccessPage.history')}</Button>
            </div>
          </div>
          <CardDescription className="flex flex-wrap gap-4 text-xs">
            <span>
              {t('table.id')}
              :
              {' '}
              #
              {issue.id.slice(0, 6)}
            </span>
            <span>
              {t('table.createdAt')}
              :
              {' '}
              {dayjs(issue.createdAt).format('DD/MM/YYYY HH:mm')}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label htmlFor="issue_description">{t('AccessPage.description')}</Label>
                <Textarea
                  className="resize-none"
                  id="issue_description"
                  defaultValue={issue.description}
                  readOnly
                />
              </div>
            </div>

            {!!issue.photos?.length && (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="relative grid gap-2">
                  <Label htmlFor="issue_photos">{t('AccessPage.photos')}</Label>
                  <Carousel className="mx-auto w-full max-w-xs">
                    {issue.photos.length > 1 && <CarouselPrevious />}
                    <CarouselContent>
                      {issue.photos.map((_, index) => (
                        <CarouselItem key={issue.photos?.[index]} className="flex !size-[300px] items-center justify-center">
                          <Image
                            src={issue.photos?.[index] ?? ''}
                            width={300}
                            height={300}
                            className="size-[300px] rounded-lg bg-background object-contain"
                            alt={`Photo ${index + 1}`}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {issue.photos.length > 1 && <CarouselNext />}
                  </Carousel>
                </div>
              </div>
            )}

          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <SquareAd
                href={currentAd?.square?.href ?? ''}
                desktopMedia={currentAd?.square?.desktop ?? ''}
                mobileMedia={currentAd?.square?.mobile ?? ''}
              />
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="relative grid gap-2">
                <Label>{t('AccessPage.location')}</Label>
                <div className="h-[50dvh] w-full overflow-hidden rounded-lg">
                  {isLoaded
                    ? (
                        <GoogleMaps
                          center={position}
                          zoom={14}
                          options={{
                            controlSize: 30,
                            draggableCursor: 'pointer',
                            draggingCursor: 'all-scroll',
                          }}
                        >
                          <Marker position={position} />
                        </GoogleMaps>
                      )
                    : <Skeleton className="h-[50dvh]" />}
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <Card className="w-full border-border/60 bg-card shadow-sm">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{commentsT('title')}</CardTitle>
              <CardDescription>{commentsT('description')}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {comments.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <Label htmlFor="issue_comment">{commentsT('add')}</Label>
            <Textarea
              id="issue_comment"
              placeholder={commentsT('placeholder')}
              className="mt-2 min-h-[110px] resize-none"
              value={commentText}
              onChange={event => setCommentText(event.target.value)}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground">{commentsT('hint')}</span>
              <Button onClick={handleCreateComment} disabled={!commentText.trim() || isSubmittingComment}>
                {commentsT('submit')}
              </Button>
            </div>
          </div>

          {isLoadingComments && (
            <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-6 text-center text-sm text-muted-foreground">
              {commentsT('loading')}
            </div>
          )}

          {!isLoadingComments && comments.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-6 text-center text-sm text-muted-foreground">
              {commentsT('empty')}
            </div>
          )}

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <Avatar className="size-12 border border-border/60 bg-background">
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(comment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{comment.user.name}</p>
                      <Badge variant={roleVariant(comment.user.role)} className="text-[10px]">
                        {roleLabel(comment.user.role)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {dayjs(comment.createdAt).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <button
                        type="button"
                        className="transition hover:text-foreground"
                        onClick={() => setActiveReplyId(comment.id)}
                      >
                        {commentsT('reply')}
                      </button>
                      {comment.user.id === currentUserId && (
                        <button
                          type="button"
                          className="transition hover:text-foreground"
                          onClick={() => handleDelete(comment.id)}
                        >
                          {commentsT('delete')}
                        </button>
                      )}
                    </div>

                    {activeReplyId === comment.id && (
                      <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                        <Textarea
                          placeholder={commentsT('reply_placeholder')}
                          className="min-h-[90px] resize-none"
                          value={replyText}
                          onChange={event => setReplyText(event.target.value)}
                        />
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            className="text-xs text-muted-foreground transition hover:text-foreground"
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyText('');
                            }}
                          >
                            {commentsT('cancel')}
                          </button>
                          <Button
                            size="sm"
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyText.trim() || submittingReplyId === comment.id}
                          >
                            {commentsT('submit_reply')}
                          </Button>
                        </div>
                      </div>
                    )}

                    {comment.replies?.length
                      ? (
                          <div className="space-y-3 border-l border-border/60 pl-4">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Avatar className="size-9 border border-border/60 bg-background">
                                    <AvatarFallback className="text-[10px] font-semibold">
                                      {getInitials(reply.user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-xs font-semibold">{reply.user.name}</p>
                                  <Badge variant={roleVariant(reply.user.role)} className="text-[10px]">
                                    {roleLabel(reply.user.role)}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground">
                                    {dayjs(reply.createdAt).format('DD/MM/YYYY HH:mm')}
                                  </span>
                                  {reply.user.id === currentUserId && (
                                    <button
                                      type="button"
                                      className="ml-auto text-[10px] text-muted-foreground transition hover:text-foreground"
                                      onClick={() => handleDelete(reply.id, comment.id)}
                                    >
                                      {commentsT('delete')}
                                    </button>
                                  )}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">{reply.text}</p>
                              </div>
                            ))}
                          </div>
                        )
                      : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
