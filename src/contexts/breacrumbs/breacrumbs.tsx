'use client';
import React, { useState } from 'react';

import { BreadcrumbContext } from './context';

export type BreadcrumbItemType = {
  label: string;
  href?: string;
};

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([]);

  return (
    <BreadcrumbContext value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext>
  );
};
