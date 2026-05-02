/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        accent: '#2F6779',
        'accent-blue': '#000000',
        'accent-hover': '#3a7d93',
        text: '#ffffff',
        'text-muted': '#d4d4d4',
        'text-dim': '#737373',
        border: '#262626',

        // shadcn-style tokens used by the new ui/ primitives + LiquidMetalHero.
        // Direct values (no CSS-var indirection) so they work without theme
        // switching infrastructure.
        foreground:               '#ffffff',
        input:                    '#262626',
        ring:                     '#2F6779',
        primary:                  '#ffffff',
        'primary-foreground':     '#0a0a0a',
        secondary:                'rgba(255,255,255,0.10)',
        'secondary-foreground':   '#ffffff',
        destructive:              '#ef4444',
        'destructive-foreground': '#ffffff',
        'accent-foreground':      '#ffffff',
        muted:                    'rgba(255,255,255,0.05)',
        'muted-foreground':       'rgba(255,255,255,0.6)',
        card:                     'rgba(255,255,255,0.05)',
        'card-foreground':        '#ffffff',
        popover:                  '#111111',
        'popover-foreground':     '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
