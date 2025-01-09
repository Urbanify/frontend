'use client';
import { createContext } from 'react';

import type { BreadcrumbItemType } from './breacrumbs';

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbItemType[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItemType[]) => void;
};

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);
