'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useViewer } from '@/components/app/use-viewer';
import { Button } from '@/components/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/dialog';
import { Input } from '@/components/ui/input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';

import { api } from '@/services/api';

import { assignableRoles } from './role-options';

import type { UserRole } from '@/types/User';

type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
};

type UsersTableProps = {
  users: User[];
  /** The roles this list shows. Searches and role changes keep the list within them. */
  roles: UserRole[];
};

type PendingChange = { user: User; role: UserRole };

export function UsersTable({ users, roles }: UsersTableProps) {
  const t = useTranslations('Users.table');
  const rolesT = useTranslations('Users.roles');
  const router = useRouter();
  const viewer = useViewer();
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState<User[]>(users);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(0);

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
          roles,
          token: viewer.token,
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
  }, [filter, viewer.token, users, roles]);

  const saveRole = async ({ user, role }: PendingChange) => {
    setSavingUserId(user.id);
    try {
      const response = await api.users.updateRole(user.id, role, viewer.token);
      if (!response.ok) {
        throw new Error('role_error');
      }
      setItems(prev => prev
        .map(item => (item.id === user.id ? { ...item, role } : item))
        .filter(item => roles.includes(item.role)));
      toast.success(t('role_success'));
      router.refresh();
    } catch {
      toast.error(t('role_error'));
    } finally {
      setSavingUserId(null);
      setPending(null);
    }
  };

  // Admins stay out of city lists, even if the API ever returns them.
  const visible = items.filter(user => user.role !== 'ADMIN');

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="search"
        aria-label={t('filterPlaceholder')}
        placeholder={t('filterPlaceholder')}
        value={filter}
        onChange={event => setFilter(event.target.value)}
        className="sm:max-w-sm"
      />

      {isSearching && <p role="status" className="text-sm text-muted-foreground">{t('searching')}</p>}

      {visible.length === 0
        ? (
            <div className="flex flex-col items-center gap-1 rounded-xl border bg-card py-12 text-center">
              <p className="font-medium text-navy">{t('empty_title')}</p>
              <p className="text-sm text-muted-foreground">{t('empty_description')}</p>
            </div>
          )
        : (
            <ul className="grid gap-3">
              {visible.map((user) => {
                const isSelf = user.id === viewer.id;
                const options = assignableRoles(viewer.role, user.role);
                const locked = isSelf || options.length === 0;
                const fullName = `${user.name} ${user.surname}`;

                return (
                  <li key={user.id} className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-navy">
                        {fullName}
                        {isSelf && <span className="ml-2 text-sm font-normal text-muted-foreground">{`(${t('you')})`}</span>}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    <Select
                      value={user.role}
                      disabled={locked || savingUserId === user.id}
                      onValueChange={(value) => {
                        if (value !== user.role) {
                          setPending({ user, role: value as UserRole });
                        }
                      }}
                    >
                      <SelectTrigger aria-label={`${t('role')}: ${fullName}`} className="h-11 w-full sm:h-9 sm:w-44">
                        <SelectValue placeholder={t('role_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {[user.role, ...options].map(role => (
                          <SelectItem key={role} value={role}>
                            {rolesT(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </li>
                );
              })}
            </ul>
          )}

      <Dialog open={pending !== null} onOpenChange={open => !open && setPending(null)}>
        <DialogContent>
          {pending && (
            <>
              <DialogHeader>
                <DialogTitle>{t('confirm_title', { name: `${pending.user.name} ${pending.user.surname}` })}</DialogTitle>
                <DialogDescription>
                  {t('confirm_description', {
                    name: `${pending.user.name} ${pending.user.surname}`,
                    role: rolesT(pending.role),
                  })}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPending(null)}>
                  {t('cancel')}
                </Button>
                <Button isLoading={savingUserId === pending.user.id} onClick={() => saveRole(pending)}>
                  {t('confirm_action')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
