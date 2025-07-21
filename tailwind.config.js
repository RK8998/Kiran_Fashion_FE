import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#2563EB', // Blue 600 (Primary)
              50: '#EFF6FF',
              100: '#DBEAFE',
              200: '#BFDBFE',
              300: '#93C5FD',
              400: '#60A5FA',
              500: '#3B82F6',
              600: '#2563EB',
              700: '#1D4ED8',
              800: '#1E40AF',
              900: '#1E3A8A',
            },
            secondary: {
              DEFAULT: '#F871A0', // Pink tone
              50: '#FDF2F8',
              100: '#FCE7F3',
              200: '#FBCFE8',
              300: '#F9A8D4',
              400: '#F472B6',
              500: '#EC4899',
              600: '#DB2777',
              700: '#BE185D',
              800: '#9D174D',
              900: '#831843',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#3B82F6', // Same primary in dark
              50: '#1E293B',
              100: '#1E40AF',
              200: '#2563EB',
              300: '#3B82F6',
              400: '#60A5FA',
              500: '#93C5FD',
              600: '#BFDBFE',
              700: '#DBEAFE',
              800: '#EFF6FF',
              900: '#FFFFFF',
            },
            secondary: {
              DEFAULT: '#F871A0', // Same secondary in dark
              50: '#3B1D2A',
              100: '#5A2D40',
              200: '#7B3E55',
              300: '#9C4E6B',
              400: '#BC5F80',
              500: '#DC7096',
              600: '#F871A0',
              700: '#F99DBA',
              800: '#FAB6CC',
              900: '#FCDDE7',
            },
          },
        },
      },
    }),
  ],
};
