'use client';

import dayjs from 'dayjs';
import { BadgeCheck, Shield, UserCog, UserRound, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';

import { api } from '@/services/api';

import type { UserRole } from '@/types/User';

type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  cpf: string;
  cityId: string;
  role: UserRole;
  createdAt: string;
};

type UsersTableProps = {
  users: User[];
  title: string;
  description: string;
  showCpf?: boolean;
};

const roleMeta: Record<UserRole, { label: UserRole; icon: typeof Users; variant: string }> = {
  ADMIN: { label: 'ADMIN', icon: Shield, variant: 'danger' },
  OWNER: { label: 'OWNER', icon: BadgeCheck, variant: 'warning' },
  MANAGER: { label: 'MANAGER', icon: UserCog, variant: 'info' },
  FINANCIAL: { label: 'FINANCIAL', icon: Users, variant: 'secondary' },
  RESIDENT: { label: 'RESIDENT', icon: UserRound, variant: 'outline' },
};

export function UsersTable({ users, title, description, showCpf = false }: UsersTableProps) {
  const t = useTranslations('Users.table');
  const rolesT = useTranslations('Users.roles');
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState<User[]>(users);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(0);
  const { data: session } = useSession();

  useEffect(() => {
    const query = filter.trim();

    if (!query) {
      setItems(users);
      return undefined;
    }

    const currentSearch = searchRef.current + 1;
    searchRef.current = currentSearch;
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.users.list({
          search: query,
          token: session?.access_token,
        });
        if (!response.ok) {
          return;
        }
        const payload = await response.json().catch(() => null);
        if (searchRef.current === currentSearch) {
          setItems(payload?.items ?? []);
        }
      } finally {
        if (searchRef.current === currentSearch) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [filter, session?.access_token, users]);

  const formatCpf = (cpf: string) => {
    if (showCpf) {
      return cpf;
    }
    const digits = cpf.replace(/\D/g, '');
    if (digits.length < 11) {
      return '***.***.***-**';
    }
    return `${digits.slice(0, 3)}.***.***-${digits.slice(-2)}`;
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setSavingUserId(userId);
    try {
      const response = await api.users.updateRole(userId, role, session?.access_token);
      if (!response.ok) {
        throw new Error('role_error');
      }
      setItems(prev => prev.map(user => (
        user.id === userId ? { ...user, role } : user
      )));
      toast.success(t('role_success'));
    } catch {
      toast.error(t('role_error'));
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <Card className="mt-4 border-border/60">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-sm text-muted-foreground">
            {t('subtitle', { count: items.length, total: items.length })}
            {isSearching ? ` ${t('searching')}` : ''}
          </p>
        </div>
        <Input
          placeholder={t('filterPlaceholder')}
          value={filter}
          onChange={event => setFilter(event.target.value)}
          className="md:max-w-xs"
        />
      </CardHeader>
      <CardContent className="pt-0">
        {items.length === 0
          ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-base font-medium">{t('empty_title')}</p>
                <p className="text-sm text-muted-foreground">{t('empty_description')}</p>
              </div>
            )
          : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('email')}</TableHead>
                    <TableHead>{t('role')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('createdAt')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((user) => {
                    const meta = roleMeta[user.role];
                    const Icon = meta.icon;
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>
                              {user.name}
                              {' '}
                              {user.surname}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatCpf(user.cpf)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={meta.variant as any} className="gap-1">
                            <Icon className="size-3.5" />
                            {rolesT(meta.label)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {dayjs(user.createdAt).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <Select
                              value={user.role}
                              onValueChange={value => handleRoleChange(user.id, value as UserRole)}
                              disabled={savingUserId === user.id}
                            >
                              <SelectTrigger className="h-9 w-[160px]">
                                <SelectValue placeholder={t('role_placeholder')} />
                              </SelectTrigger>
                              <SelectContent>
                                {(Object.keys(roleMeta) as UserRole[]).map(role => (
                                  <SelectItem key={role} value={role}>
                                    {rolesT(role)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
      </CardContent>
    </Card>
  );
}
