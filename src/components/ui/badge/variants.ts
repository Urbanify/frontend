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
        ghost: 'text-gray-800 hover:text-gray-800/80',
        link: 'text-blue-600 underline hover:text-blue-600/80',
        info: 'bg-blue-100 text-blue-800 hover:bg-blue-200/80',
        success: 'bg-green-100 text-green-800 hover:bg-green-200/80',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200/80',
        danger: 'bg-red-100 text-red-800 hover:bg-red-200/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
