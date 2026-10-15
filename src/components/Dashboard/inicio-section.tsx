import type { ReactNode } from 'react';

export type InicioSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function InicioSection({ title, action, children }: InicioSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
