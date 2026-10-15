import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
};

// Eyebrow with a short rule, H2 with a mint dot at the end (decorative). The dot replaces a final period.
// Color is a plain string on purpose: cn() (twMerge) would drop text-display-lg / text-eyebrow next to a text color.
export function SectionHeading({ id, eyebrow, title, tone = 'light', align = 'left' }: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <div className={cn(align === 'center' && 'text-center')}>
      <p
        className={`reveal text-eyebrow font-semibold uppercase before:mr-3 before:inline-block before:h-px before:w-6 before:align-middle before:content-[''] ${dark ? 'text-mint before:bg-mint' : 'text-primary before:bg-primary'}`}
      >
        {eyebrow}
      </p>
      <h2 id={id} className={`reveal mt-4 text-balance font-display text-display-lg ${dark ? 'text-white' : 'text-navy'}`}>
        {title.replace(/\.$/, '')}
        <span aria-hidden="true" className="ml-[0.08em] inline-block size-[0.16em] rounded-full bg-mint align-baseline" />
      </h2>
    </div>
  );
}
