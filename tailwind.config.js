const spacing = {}
const marginSpacing = {}
for (let i = 1; i <= 720; i++) {
  const index = i * 0.5
  spacing[index] = (i * 0.125) + 'rem'
  marginSpacing[index] = (i * 0.125) + 'rem'
  marginSpacing[`-${index}`] = -(i * 0.125) + 'rem'
}

const lineHeight = {}
for (let i = 0; i < 10; i++) {
  const value = 1 + (i / 10)
  lineHeight[value] = value
}

const zIndex = {}
for (let i = 0; i <= 100; i++) {
  zIndex[i] = i
}

const strokeWidth = {}
for (let i = 0; i <= 20; i++) {
  strokeWidth[i] = i + 'px'
}

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          900: '#222222',
          800: '#666666',
          700: '#757575',
          650: '#878787',
          600: '#919191',
          500: '#c4c4c4',
          400: '#dcdcdc',
          200: '#f5f5f5',
          100: '#f9f9f9',
          50: '#fafafa',
          0: '#ffffff'
        },
        primary: {
          DEFAULT: '#444444',
          middle: '#e0e0e0',
          thin: '#eeeded',
        },
        brand: {
          DEFAULT: '#21b185',
          dark: '#20a17a',
          light: '#e9f8f3',
        },
        assist: {
          blue: '#268cc8',
          'light-blue': '#52c9d7',
          'light-yellow': '#fed402'
        },
        warn: {
          DEFAULT: '#b40000',
          middle: '#E04A4A'
        }
      },
      fontSize: {
        h1: ['48px', '1'],
        h2: ['40px', '1'],
        h3: ['32px', '1'],
        h4: ['24px', '1'],
        h5: ['20px', '1'],
        h6: ['18px', '1'],
        body1: ['16px', '1'],
        body2: ['14px', '1'],
        caption: ['12px', '1'],
      },
      zIndex: {
        "sidebar": 100,
        "header": 100,
        "modal": 200,
        "modal-confirm": 200,
        "flash-msg": 201,
        "footer": 200,
        ...zIndex
      },
      spacing: spacing,
      maxWidth: spacing,
      minWidth: spacing,
      maxHeight: spacing,
      minHeight: spacing,
      lineHeight: lineHeight,
      screens: {
        '2xl': '1440px'
      },
      gridTemplateColumns: {
        'lobby': 'repeat(auto-fill, 232px)'
      },
      strokeWidth: strokeWidth,
      margin: marginSpacing
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
