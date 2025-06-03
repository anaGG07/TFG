// Plugin personalizado para EYRA colors
const plugin = require('tailwindcss/plugin');

const eyraColorsPlugin = plugin(function({ addUtilities, theme }) {
  const colors = theme('colors');
  
  const customUtilities = {
    '.border-primary': {
      'border-color': colors.primary.DEFAULT || '#d30006',
    },
    '.border-primary-light': {
      'border-color': colors.primary.light || '#ff393f',
    },
    '.border-primary-dark': {
      'border-color': colors.primary.dark || '#650e00',
    },
    '.text-primary': {
      'color': colors.primary.DEFAULT || '#d30006',
    },
    '.text-primary-light': {
      'color': colors.primary.light || '#ff393f',
    },
    '.text-primary-dark': {
      'color': colors.primary.dark || '#650e00',
    },
    '.bg-primary': {
      'background-color': colors.primary.DEFAULT || '#d30006',
    },
    '.bg-primary-light': {
      'background-color': colors.primary.light || '#ff393f',
    },
    '.bg-primary-dark': {
      'background-color': colors.primary.dark || '#650e00',
    },
    '.hover\\:bg-primary:hover': {
      'background-color': colors.primary.DEFAULT || '#d30006',
    },
    '.hover\\:text-primary:hover': {
      'color': colors.primary.DEFAULT || '#d30006',
    },
    '.hover\\:text-white:hover': {
      'color': '#ffffff',
    },
  };
  
  addUtilities(customUtilities);
});

module.exports = eyraColorsPlugin;
