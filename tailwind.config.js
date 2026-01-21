/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#f4f7f5',
                    100: '#e3ebe6',
                    200: '#c5d9ce',
                    300: '#9bbfa9',
                    400: '#72a184',
                    500: '#528565',
                    600: '#3e694d',
                    700: '#32543f',
                    800: '#294334',
                    900: '#22382c',
                },
                sand: {
                    50: '#fbf9f5',
                    100: '#f5f0e6',
                    200: '#ebdcc5',
                    300: '#dec09d',
                    400: '#ce9f73',
                    500: '#c58253',
                    600: '#b86644',
                    700: '#994f38',
                    800: '#7f4133',
                    900: '#67362d',
                },
                charcoal: {
                    50: '#f6f6f7',
                    100: '#e1e3e6',
                    200: '#c2c7cc',
                    300: '#9da5ad',
                    400: '#7a848f',
                    500: '#5f6975',
                    600: '#4b535d',
                    700: '#3d434b',
                    800: '#35393f',
                    900: '#2f3237',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
