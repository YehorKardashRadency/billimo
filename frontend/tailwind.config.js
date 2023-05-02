/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative:true,
    files:[
    "./src/**/*.{html,ts}",
    ]
  },
  theme: {
    extend: {
      colors: {
        'black':'#202123',
        'grey': {
          7: '#F2F4F8',
          6: '#E5E8EC',
          5: '#CAD0D9',
          4: '#AFB4BD',
          3: '#898E96',
          2: '#70757E',
          1: '#454950',
        },
        'sgreen': {
          light: '#EFFAF4',
          2: '#ACE9C5',
          DEFAULT: '#64C68D',
          dark:'#35995F',
        },
        'ablue': {
          light: '#0D99FF',
          medium: '#9FD7FF',
          DEFAULT: '#0D99FF',
        }
    }
    },
  },
  plugins: [],
}
