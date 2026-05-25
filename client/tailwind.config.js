export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        signred: '#c5161d',
        signredDark: '#8f0f14',
        ink: '#050505',
        coal: '#101010',
        steel: '#1b1b1d',
        line: '#2b2b2e',
      },
      fontFamily: {
        display: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        redline: 'inset 0 1px 0 rgba(197,22,29,.45)',
      },
    },
  },
  plugins: [],
};
