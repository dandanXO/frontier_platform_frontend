const plugin = require('tailwindcss/plugin')
const colors = require('./colors').default

const spacing = {}
const marginSpacing = {}
for (let i = 1; i <= 720; i++) {
  const index = i * 0.5
  spacing[index] = i * 0.125 + 'rem'
  marginSpacing[index] = i * 0.125 + 'rem'
  marginSpacing[`-${index}`] = -(i * 0.125) + 'rem'
}

const lineHeight = {}
for (let i = 0; i < 10; i++) {
  const value = 1 + i / 10
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

module.exports = plugin(function () {}, {
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      pink: colors.pink,
      blue: colors.blue,
      purple: colors.purple,
      cyan: colors.cyan,
      yellow: colors.yellow,
      red: colors.red,
    },
    extend: {
      colors: {
        grey: colors.grey,
        primary: colors.primary,
        brown: colors.brown,
        forestgreen: colors.forestgreen,
        peacock: colors.peacock,
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
        caption: ['12px', '1'], // 因為牽扯到的程式碼範圍太廣，暫時為了避免衝突所以不將 caption 改名為 caption1，等日後再調整
        caption2: ['10px', '1'],
      },
      zIndex: {
        ...zIndex,
        sidebar: 100,
        header: 100,
        modal: 200,
        'modal-confirm': 200,
        'flash-msg': 201,
        footer: 200,
        popper: 999,
        tooltip: 1000,
        loading: 1001,
      },
      spacing: spacing,
      maxWidth: spacing,
      minWidth: spacing,
      maxHeight: spacing,
      minHeight: spacing,
      lineHeight: lineHeight,
      screens: {
        '2xl': '1440px',
      },
      gridTemplateColumns: {
        lobby: 'repeat(auto-fill, 232px)',
      },
      strokeWidth: strokeWidth,
      margin: marginSpacing,
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      },
      boxShadow: {
        2: [
          '0px 0.15px 0.45px rgba(103, 103, 103, 0.11)',
          '0px 0.8px 1.8px rgba(103, 103, 103, 0.13)',
        ],
        4: [
          '0px 1px 5px rgba(103, 103, 103, 0.12)',
          '0px 2px 3px rgba(103, 103, 103, 0.15)',
        ],
        8: [
          '0px 1.4px 5px rgba(103, 103, 103, 0.1)',
          '0px 2.6px 6px rgba(103, 103, 103, 0.15)',
        ],
        16: [
          '0px 6px 14.4px rgba(103, 103, 103, 0.13)',
          '0px 1.5px 3.6px rgba(103, 103, 103, 0.24)',
        ],
        32: [
          '0px 10px 30px rgba(103, 103, 103, 0.22)',
          '0px 3px 4px rgba(103, 103, 103, 0.28)',
        ],
      },
    },
  },
})
