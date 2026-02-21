/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                shubakar: {
                    primary: '#FF6F61', // Salmon/Vibrant Red
                    secondary: '#38A3A5', // Teal / Mint
                    accent: '#FFD700', // Gold/Yellow
                    bg: '#FFFFFF',
                    softBg: '#F0F9F9',
                    border: '#F0F0F0',
                    text: '#2D3436',
                    muted: '#636E72',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
                'vibrant': '0 4px 14px 0 rgba(255, 111, 97, 0.39)',
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #FFF5F5 0%, #F0F9F9 100%)',
            }
        },
    },
    plugins: [],
}
