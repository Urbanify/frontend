import { cn } from '@/lib/utils';

type SquareAdProps = {
  href: string; // Link de destino
  desktopMedia: string; // URL da mídia para desktop
  mobileMedia: string; // URL da mídia para mobile
  className?: string;
  label?: string;
};

/**
 * Mobile should be 300x300
 * Desktop should be 300x300
 */
export const SquareAd: React.FC<SquareAdProps> = ({ href, desktopMedia, mobileMedia, className, label = 'Anúncio' }) => {
  return (
    <div className="flex w-fit flex-col">
      <div className="size-[316px] border p-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'block w-[300px] h-[300px] bg-card-foreground',
            className,
          )}
        >
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopMedia} />
            <img
              src={mobileMedia}
              alt="Square Ad"
              className="size-full bg-card-foreground object-cover"
            />
          </picture>
        </a>
      </div>
      <span className="mt-2 text-center text-xs uppercase text-accent">{label}</span>
    </div>
  );
};
