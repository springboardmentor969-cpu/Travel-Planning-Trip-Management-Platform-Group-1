/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand': '#050A18',
        'brand-light': '#0A1433',
        'brand-card': '#0A1433',
        'logo-orange': '#FB923C',
        'logo-yellow': '#FACC15', // yellow-400
        'logo-green': '#4ADE80',  // green-400
      },
      backgroundImage: {
        
        'logo-gradient': 'linear-gradient(to right, #FB923C, #FACC15, #4ADE80)',
        'logo-gradient-br': 'linear-gradient(to bottom right, #FB923C, #FACC15, #4ADE80)',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card-glow': '0 0 30px rgba(10, 20, 51, 0.5)',
        'logo-glow': '0 0 25px rgba(250, 204, 21, 0.4)', // yellow glow
      }
    },
  },
  plugins: [],
}