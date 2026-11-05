/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
                heading: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
                display: ['Fraunces', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            colors: {
                gray: {
                    900: '#111827',
                    800: '#1f2937',
                    700: '#374151',
                    600: '#4b5563',
                    500: '#6b7280',
                    100: '#f3f4f6',
                    50: '#f9fafb',
                },
                orange: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    500: '#f97316',
                    600: '#ea580c',
                },
                terracotta: {
                    50: '#fdf5f2',
                    100: '#fbe8e0',
                    200: '#f6d2c4',
                    300: '#efb29b',
                    400: '#e48867',
                    500: '#d66540',
                    600: '#c8522d',
                    700: '#a74022',
                    800: '#893620',
                    900: '#712f1e',
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                scaleIn: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow-once': 'spin 1s ease-out forwards',
                shimmer: 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
        },
    },
    plugins: [],
};
