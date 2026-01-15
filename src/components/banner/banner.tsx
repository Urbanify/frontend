'use client';

type BannerMessageProps = {
  message?: string;
  onClick?: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
};

export default function BannerMessage({ message, onClick, children }: BannerMessageProps) {
  return (
    <div
      onClick={e => onClick && onClick(e)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(e as any);
        }
      }}
      role="button"
      tabIndex={0}
      className="mb-4 w-full rounded-lg border-2 border-primary bg-card p-2 text-muted-foreground"
    >
      <p className="text-center">
        {message}
        {' '}
        {children}
      </p>
    </div>
  );
}
