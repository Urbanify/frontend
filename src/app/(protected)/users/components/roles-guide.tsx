'use client';

import { useTranslations } from 'next-intl';

type RoleKey = 'citizen' | 'manager' | 'owner';

type RolesGuideProps = {
  /** The team screen explains all three roles; the citizens screen only the citizen role. */
  roles: RoleKey[];
  /** Show the "Em breve" line for the owner role (team screen only). */
  showOwnerSoon?: boolean;
};

// Mobile: a collapsible card above the list. Desktop: a side card. Same content in both.
export function RolesGuide({ roles, showOwnerSoon = false }: RolesGuideProps) {
  const t = useTranslations('Users.RolesGuide');

  const body = (
    <div className="mt-4 space-y-4">
      <dl className="space-y-4">
        {roles.map(role => (
          <div key={role}>
            <dt className="font-semibold text-navy">{t(role)}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              {t(`${role}_text`)}
              {role === 'owner' && showOwnerSoon && (
                <span className="mt-1 block text-[13px]">{t('owner_soon')}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="rounded-lg bg-muted p-3 text-sm text-foreground">{t('volunteer')}</p>
    </div>
  );

  return (
    <>
      <details className="rounded-xl border bg-card p-4 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-navy">{t('title')}</summary>
        {body}
      </details>

      <aside aria-label={t('title')} className="hidden rounded-xl border bg-card p-5 lg:block">
        <h2 className="font-semibold text-navy">{t('title')}</h2>
        {body}
      </aside>
    </>
  );
}
