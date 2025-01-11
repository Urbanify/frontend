import { cn } from '@/lib/utils';

type VerticalBannerProps = {
  href: string; // Link de destino
  desktopMedia: string; // URL da mídia para desktop
  mobileMedia: string; // URL da mídia para mobile
  className?: string;
  label?: string;
};

/**
 * Componente para anúncios fixos
 * - Mobile: is not displayed
 * - Desktop: 160x600
 */
export const VerticalBannerAd: React.FC<VerticalBannerProps> = ({
  href,
  desktopMedia,
  mobileMedia,
  className,
  label = 'Anúncio',
}) => {
  return (
    <div className="flex w-fit flex-col">
      <div className="border p-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'hidden sm:block w-[120px] sm:w-[160px] h-[240px] sm:h-[600px] bg-card-foreground',
            className,
          )}
        >
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopMedia} />
            <img
              src={mobileMedia}
              alt="Vertical Banner Ad"
              className="size-full bg-card-foreground object-cover"
            />
          </picture>
        </a>
      </div>
      <span className="mt-2 text-center text-xs uppercase text-foreground">{label}</span>
    </div>

  );
};
