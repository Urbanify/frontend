import { cn } from '@/lib/utils';

import { issueCategories, type IssueCategory } from '@/types/Issue';

// One hue per category (ESPEC-TELAS 1, "Cor de categoria"). Only the icon is colored, on a tinted square.
// Tailwind needs the full class names, so keep them literal here.
const CATEGORY_TONE: Record<IssueCategory, string> = {
  INFRASTRUCTURE: 'bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FB923C]',
  ENVIRONMENT: 'bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF]',
  TRANSPORTATION: 'bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#A78BFA]/15 dark:text-[#A78BFA]',
  SAFETY: 'bg-[#BE123C]/10 text-[#BE123C] dark:bg-[#FB7185]/15 dark:text-[#FB7185]',
  COMUNITY: 'bg-[#0369A1]/10 text-[#0369A1] dark:bg-[#38BDF8]/15 dark:text-[#38BDF8]',
};

export type CategoryTileProps = {
  category: IssueCategory;
  /** Sizes the square, e.g. "size-16". */
  className?: string;
  iconClassName?: string;
};

export function CategoryTile({ category, className, iconClassName }: CategoryTileProps) {
  const Icon = issueCategories.find(option => option.value === category)?.icon;

  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-md', CATEGORY_TONE[category], className)}>
      {Icon && <Icon className={cn('size-6', iconClassName)} aria-hidden />}
    </span>
  );
}
