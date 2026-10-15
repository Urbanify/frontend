/* eslint-disable ts/no-require-imports */
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        // => @media (min-width: 375px) { ... }
        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '768px',
        // => @media (min-width: 768px) { ... }

        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }

        '3xl': '1920px',
        // => @media (min-width: 1920px) { ... }
      },
      fontFamily: {
        // Inter for all text, Space Grotesk for page titles and big numbers (see layout.tsx)
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-space-grotesk)', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)', // 12px, cards
        md: 'calc(var(--radius) - 2px)', // 10px, buttons and fields
        sm: 'calc(var(--radius) - 4px)',
      },
      // Landing and visit tokens (ESPEC-HOME-VISITA §4)
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6.2vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-lg': ['clamp(1.875rem, 3.6vw, 2.875rem)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['clamp(1.5rem, 2.4vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'lead': ['clamp(1.0625rem, 1.5vw, 1.375rem)', { lineHeight: '1.5' }],
        'eyebrow': ['0.8125rem', { lineHeight: '1', letterSpacing: '0.14em' }],
      },
      boxShadow: {
        float: '0 10px 30px -14px rgb(0 14 46 / 0.35)',
      },
      backgroundImage: {
        'navy-glow': 'radial-gradient(1200px 620px at 85% 0%, #0A2A8A 0%, #000E2E 60%)',
        'hero-glow': 'radial-gradient(900px 520px at 50% 0%, hsl(var(--card)), transparent 70%), radial-gradient(700px 360px at 50% 100%, rgb(3 78 255 / 0.06), transparent 70%)',
      },
      transitionTimingFunction: {
        // ease-out keeps Tailwind's default; use var(--ease-out) in CSS for the landing curve
        spring: 'cubic-bezier(.34,1.45,.64,1)',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      colors: {
        navy: 'hsl(var(--navy))',
        success: 'hsl(var(--success))',
        mint: 'hsl(var(--mint))',
        tone: {
          neutral: {
            bg: 'hsl(var(--tone-neutral-bg))',
            fg: 'hsl(var(--tone-neutral-fg))',
          },
          blue: {
            bg: 'hsl(var(--tone-blue-bg))',
            fg: 'hsl(var(--tone-blue-fg))',
          },
          amber: {
            bg: 'hsl(var(--tone-amber-bg))',
            fg: 'hsl(var(--tone-amber-fg))',
          },
          green: {
            bg: 'hsl(var(--tone-green-bg))',
            fg: 'hsl(var(--tone-green-fg))',
          },
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          'DEFAULT': 'hsl(var(--sidebar-background))',
          'foreground': 'hsl(var(--sidebar-foreground))',
          'primary': 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          'accent': 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          'border': 'hsl(var(--sidebar-border))',
          'ring': 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
