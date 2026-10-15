import type { LucideIcon } from 'lucide-react';

import { issueCategories, type IssueCategory, type IssueType } from '@/types/Issue';

export const TOTAL_STEPS = 4;
export const MAX_PHOTOS = 5;
export const MIN_DESCRIPTION = 30;

export type Coordinates = { lat: number; lng: number };

export type DraftPhoto = { file: File; url: string };

export type ReportDraft = {
  category: IssueCategory | '';
  type: IssueType | '';
  photos: DraftPhoto[];
  location: Coordinates | null;
  address: string;
  description: string;
};

export const EMPTY_DRAFT: ReportDraft = {
  category: '',
  type: '',
  photos: [],
  location: null,
  address: '',
  description: '',
};

export type CategoryOption = { value: IssueCategory; icon?: LucideIcon };
export type TypeOption = { value: IssueType; icon?: LucideIcon; category: IssueCategory };

export const CATEGORIES: CategoryOption[] = issueCategories
  .filter(option => option.isHeading)
  .map(option => ({ value: option.value as IssueCategory, icon: option.icon }));

// Every type, tagged with its category, in catalog order.
export const TYPE_OPTIONS: TypeOption[] = [];
let category: IssueCategory | undefined;
for (const option of issueCategories) {
  if (option.isHeading) {
    category = option.value as IssueCategory;
  } else if (category) {
    TYPE_OPTIONS.push({ value: option.value as IssueType, icon: option.icon, category });
  }
}

export type StepProps = {
  draft: ReportDraft;
  onChange: (patch: Partial<ReportDraft>) => void;
  onNext: () => void;
};
