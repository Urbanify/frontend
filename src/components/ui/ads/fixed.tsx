import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type FixedAdProps = {
  href: string; // Link de destino
  desktopMedia: string; // URL da mídia para desktop
  mobileMedia: string; // URL da mídia para mobile
  className?: string; // Classe opcional
};

/**
 * Componente para anúncios fixos
 * - Mobile: 320x50
 * - Desktop: 728x66
 */
export const FixedAd: React.FC<FixedAdProps> = ({
  href,
  desktopMedia,
  mobileMedia,
  className,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = () => {
    setIsMinimized(prev => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleToggle();
    }
  };

  return (
    <div
      className={cn(
        'fixed w-[-webkit-fill-available] transition-all bottom-0 z-[1]',
        isMinimized ? 'translate-y-[66px] md:translate-y-[82px]' : 'translate-y-0',
        className,
      )}
    >
      <div className="relative flex w-full items-center justify-center border border-accent bg-card-foreground p-2">
        {/* Botão de Minimizar/Maximizar */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className="absolute -top-6 right-7 flex w-12 cursor-pointer items-center justify-center rounded-t-md border border-b-0 border-accent bg-card-foreground text-accent md:-top-8 md:right-14 md:w-14"
        >
          {isMinimized
            ? (
                <ChevronUp className="size-6 md:size-8" />
              )
            : (
                <ChevronDown className="size-6 md:size-8" />
              )}
        </div>

        {/* Imagem do Anúncio */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-[50px] w-[320px] md:h-[66px] md:w-[728px]"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopMedia} />
            <img
              src={mobileMedia}
              alt="Fixed Ad"
              className="size-full bg-card-foreground object-cover"
            />
          </picture>
        </a>
      </div>
    </div>
  );
};
