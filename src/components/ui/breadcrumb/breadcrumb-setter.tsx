'use client';
import { useEffect } from 'react';

import { useBreadcrumbs } from '@/contexts/breacrumbs/useBreadcrumbs';

export type BreadcrumbConfig = {
  label: string;
  href?: string;
};

/**
 * Client-side Breadcrumb Setter
 * @param {BreadcrumbConfig[]} breadcrumbs - Array of breadcrumb items
 */
const BreadcrumbSetter: React.FC<{ breadcrumbs: BreadcrumbConfig[] }> = ({ breadcrumbs }) => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, breadcrumbs]);

  return null; // This component does not render anything
};

export default BreadcrumbSetter;
