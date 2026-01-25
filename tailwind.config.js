/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            colors: {
                ios: {
                    bg: '#F5F5F7',
                    blue: '#007AFF',
                    gray: '#8E8E93',
                    light: '#F2F2F7',
                    surface: 'rgba(255, 255, 255, 0.85)'
                }
            },
            animation: {
                'float': 'float 20s infinite ease-in-out alternate',
                'float-delayed': 'float 25s infinite ease-in-out alternate-reverse',
                'pulse-slow': 'pulse 8s infinite cubic-bezier(0.4, 0, 0.6, 1)',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.2, 0, 0.2, 1) forwards',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                float: {
                    '0%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '100%': { transform: 'translate(20px, 40px) rotate(5deg)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
                'glass-hover': '0 30px 60px -10px rgba(0, 0, 0, 0.15)',
                'volume': '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                'volume-hover': '0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
