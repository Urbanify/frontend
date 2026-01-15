import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        ghost: 'text-muted-foreground hover:text-foreground',
        link: 'text-primary underline hover:text-primary/80',
        info: 'bg-lilac-hard text-black-hard hover:bg-lilac-light',
        success: 'bg-mint-hard text-black-hard hover:bg-mint-light',
        warning: 'bg-yellow-hard text-black-hard hover:bg-yellow-light',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
