/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    header: '#003333', // Deep teal from image
                    accent: '#FFC760', # Amber / Gold
          accentHover: '#F5B74D',
                    surface: '#FFFFFF',
                    bg: '#F8FAFA',
                    tableHeader: '#F9FAFB',
                    border: '#E5E7EB',
                },
                status: {
                    manager: '#FFC760',
                    admin: '#003333',
                    auditor: '#10B981',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [],
}
