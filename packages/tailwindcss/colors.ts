import type { DefaultColors } from 'tailwindcss/types/generated/colors'
import defaultColors from 'tailwindcss/colors'

export interface Colors {
  pink: DefaultColors['pink']
  blue: DefaultColors['blue']
  purple: DefaultColors['purple']
  cyan: {
    900: '#001C49'
    800: '#08295F'
    700: '#0C3A75'
    600: '#125290'
    500: '#1C6DAC'
    400: '#268CC8'
    300: '#57B4DF'
    200: '#7AD1ED'
    100: '#A8EAFA'
    0: '#D4F7FD'
  }
  yellow: {
    900: '#423201'
    800: '#74500E'
    700: '#866729'
    600: '#A8863A'
    500: '#C9A74C'
    400: '#F2C94C'
    300: '#F3DB86'
    200: '#F7E69D'
    100: '#FBF0BE'
    0: '#FEF9DB'
  }
  red: {
    900: '#460118'
    800: '#6B0E2D'
    700: '#821733'
    600: '#A0253A'
    500: '#C03643'
    400: '#E04A4B'
    300: '#F0938A'
    200: '#F5A491'
    100: '#FAC9B8'
    0: '#FDE7DA'
  }
  grey: {
    900: '#262626'
    850: '#303030'
    800: '#3C3C3C'
    750: '#454545'
    700: '#515151'
    600: '#676767'
    500: '#7D7D7D'
    400: '#939393'
    300: '#A8A8A8'
    250: '#BEBEBE'
    200: '#D4D4D4'
    150: '#E9E9E9'
    100: '#F4F4F4'
    50: '#F9F9F9'
    0: '#FFFFFF'
  }
  primary: {
    950: '#262D2B'
    900: '#03393E'
    800: '#074E54'
    700: '#0A6665'
    600: '#0F7F73'
    500: '#20A17A'
    400: '#21B185'
    300: '#3EC39B'
    200: '#71DABB'
    100: '#CFF6EB'
    50: '#E9F8F3'
    0: '#F4FBF9'
  }
  brown: {
    800: '#402816'
    500: '#A16438'
    400: '#B48360'
    300: '#C7A288'
    100: '#ECE0D7'
    50: '#F6F0EB'
  }
  forestgreen: {
    800: '#1D401D'
    500: '#48A148'
    400: '#6DB46D'
    300: '#91C791'
    100: '#DAECDA'
    50: '#EDF6ED'
  }
  peacock: {
    800: '#0E3D41'
    500: '#2498A3'
    400: '#4DACB5'
    300: '#77C0C7'
    100: '#CAE7EA'
    50: '#DEF1F3'
  }
}

const colors: Colors = {
  pink: defaultColors.pink,
  blue: defaultColors.blue,
  purple: defaultColors.purple,
  cyan: {
    900: '#001C49',
    800: '#08295F',
    700: '#0C3A75',
    600: '#125290',
    500: '#1C6DAC',
    400: '#268CC8',
    300: '#57B4DF',
    200: '#7AD1ED',
    100: '#A8EAFA',
    0: '#D4F7FD',
  },
  yellow: {
    900: '#423201',
    800: '#74500E',
    700: '#866729',
    600: '#A8863A',
    500: '#C9A74C',
    400: '#F2C94C',
    300: '#F3DB86',
    200: '#F7E69D',
    100: '#FBF0BE',
    0: '#FEF9DB',
  },
  red: {
    900: '#460118',
    800: '#6B0E2D',
    700: '#821733',
    600: '#A0253A',
    500: '#C03643',
    400: '#E04A4B',
    300: '#F0938A',
    200: '#F5A491',
    100: '#FAC9B8',
    0: '#FDE7DA',
  },
  grey: {
    900: '#262626',
    850: '#303030',
    800: '#3C3C3C',
    750: '#454545',
    700: '#515151',
    600: '#676767',
    500: '#7D7D7D',
    400: '#939393',
    300: '#A8A8A8',
    250: '#BEBEBE',
    200: '#D4D4D4',
    150: '#E9E9E9',
    100: '#F4F4F4',
    50: '#F9F9F9',
    0: '#FFFFFF',
  },
  primary: {
    950: '#262D2B',
    900: '#03393E',
    800: '#074E54',
    700: '#0A6665',
    600: '#0F7F73',
    500: '#20A17A',
    400: '#21B185',
    300: '#3EC39B',
    200: '#71DABB',
    100: '#CFF6EB',
    50: '#E9F8F3',
    0: '#F4FBF9',
  },
  brown: {
    800: '#402816',
    500: '#A16438',
    400: '#B48360',
    300: '#C7A288',
    100: '#ECE0D7',
    50: '#F6F0EB',
  },
  forestgreen: {
    800: '#1D401D',
    500: '#48A148',
    400: '#6DB46D',
    300: '#91C791',
    100: '#DAECDA',
    50: '#EDF6ED',
  },
  peacock: {
    800: '#0E3D41',
    500: '#2498A3',
    400: '#4DACB5',
    300: '#77C0C7',
    100: '#CAE7EA',
    50: '#DEF1F3',
  },
}

export default colors
