'use client';
import { createContext } from 'react';

import type { AdContextType } from './useAd';

export const AdContext = createContext<AdContextType | undefined>(undefined);
