'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb/breadcrumb';

import { useBreadcrumbs } from '@/contexts/breacrumbs/useBreadcrumbs';

export default function Breadcrumbs() {
  const { breadcrumbs } = useBreadcrumbs();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <BreadcrumbItem key={`breadcrumb-${index}`} className={index > 0 ? 'hidden md:block' : ''}>
            {item.href
              ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )
              : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
