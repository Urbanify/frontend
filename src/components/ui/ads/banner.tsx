import { cn } from '@/lib/utils';

type BannerProps = {
  href: string; // Link de destino
  desktopMedia: string; // URL da mídia para desktop
  mobileMedia: string; // URL da mídia para mobile
  className?: string;
  label?: string;
};

/**
 * Mobile should be 300x100
 * Desktop should be 728x90
 */
export const BannerAd: React.FC<BannerProps> = ({ href, desktopMedia, mobileMedia, className, label = 'Anúncio' }) => {
  return (
    <div className="flex w-fit flex-col">
      <div className="border p-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'block w-[300px] h-[100px] md:w-[728px] md:max-w-[728px] md:h-[90px] bg-card-foreground',
            className,
          )}
        >
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopMedia} />
            <img
              src={mobileMedia}
              alt="Banner Ad"
              className="size-full bg-card-foreground object-cover"
            />
          </picture>
        </a>
      </div>
      <span className="mt-2 text-center text-xs uppercase text-foreground">{label}</span>
    </div>
  );
};
