import type { DefaultColors } from 'tailwindcss/types/generated/colors'
import defaultColors from 'tailwindcss/colors'

export interface Colors {
  pink: {
    50: {
      DEFAULT: DefaultColors['pink'][50]
      v1: '#FEE6F4'
    }
    100: {
      DEFAULT: DefaultColors['pink'][100]
      v1: '#F9B8DF'
    }
    200: {
      DEFAULT: DefaultColors['pink'][200]
      v1: '#F28ACA'
    }
    300: {
      DEFAULT: DefaultColors['pink'][300]
      v1: '#E75EB4'
    }
    400: {
      DEFAULT: DefaultColors['pink'][400]
      v1: '#D8389D'
    }
    500: {
      DEFAULT: DefaultColors['pink'][500]
      v1: '#C71585'
    }
    600: {
      DEFAULT: DefaultColors['pink'][600]
      v1: '#AC0F72'
    }
    700: {
      DEFAULT: DefaultColors['pink'][700]
      v1: '#900A5E'
    }
    800: {
      DEFAULT: DefaultColors['pink'][800]
      v1: '#73064B'
    }
    900: {
      DEFAULT: DefaultColors['pink'][900]
      v1: '#550337'
    }
  }
  blue: DefaultColors['blue']
  purple: {
    50: {
      DEFAULT: DefaultColors['purple'][50]
      v1: '#F1E8F5'
    }
    100: {
      DEFAULT: DefaultColors['purple'][100]
      v1: '#D8C0E1'
    }
    200: {
      DEFAULT: DefaultColors['purple'][200]
      v1: '#BE9ACB'
    }
    300: {
      DEFAULT: DefaultColors['purple'][300]
      v1: '#A375B4'
    }
    400: {
      DEFAULT: DefaultColors['purple'][400]
      v1: '#88529C'
    }
    500: {
      DEFAULT: DefaultColors['purple'][500]
      v1: '#6C3082'
    }
    600: {
      DEFAULT: DefaultColors['purple'][600]
      v1: '#5C2870'
    }
    700: {
      DEFAULT: DefaultColors['purple'][700]
      v1: '#4D205D'
    }
    800: {
      DEFAULT: DefaultColors['purple'][800]
      v1: '#3D184A'
    }
    900: {
      DEFAULT: DefaultColors['purple'][900]
      v1: '#2C1136'
    }
  }
  white: '#FAFCFC'
  black: '#2B2C2C'
  cyan: {
    900: {
      DEFAULT: '#001C49'
      v1: '#004557'
    }
    800: {
      DEFAULT: '#08295F'
      v1: '#025D75'
    }
    700: {
      DEFAULT: '#0C3A75'
      v1: '#057693'
    }
    600: {
      DEFAULT: '#125290'
      v1: '#098DAF'
    }
    500: {
      DEFAULT: '#1C6DAC'
      v1: '#0EA4CB'
    }
    400: {
      DEFAULT: '#268CC8'
      v1: '#32B9DC'
    }
    300: {
      DEFAULT: '#57B4DF'
      v1: '#5CCCEA'
    }
    200: {
      DEFAULT: '#7AD1ED'
      v1: '#8ADDF4'
    }
    100: {
      DEFAULT: '#A8EAFA'
      v1: '#B8ECFB'
    }
    50: {
      DEFAULT: '#ECF8FB'
      v1: '#E6F9FF'
    }
    0: '#D4F7FD'
  }
  yellow: {
    900: {
      DEFAULT: '#423201'
      v1: '#5D4300'
    }
    800: {
      DEFAULT: '#74500E'
      v1: '#7E5C00'
    }
    700: {
      DEFAULT: '#866729'
      v1: '#9D7300'
    }
    600: {
      DEFAULT: '#A8863A'
      v1: '#BC8A00'
    }
    500: {
      DEFAULT: '#C9A74C'
      v1: '#D9A100'
    }
    400: {
      DEFAULT: '#F2C94C'
      v1: '#E9B62E'
    }
    300: {
      DEFAULT: '#F3DB86'
      v1: '#F5CA5C'
    }
    200: {
      DEFAULT: '#F7E69D'
      v1: '#FDDB8A'
    }
    100: {
      DEFAULT: '#FBF0BE'
      v1: '#FFEBB8'
    }
    50: {
      DEFAULT: '#FEF9EB'
      v1: '#FFF8E6'
    }
    0: '#FEF9DB'
  }
  green: {
    50: {
      DEFAULT: '#f0f8f5'
      v1: '#E6F3EE'
    }
    100: {
      DEFAULT: '#B8DBD0'
      v1: '#B8DBD0'
    }
    200: {
      DEFAULT: '#9CC5BA'
      v1: '#8AC1B1'
    }
    300: {
      DEFAULT: '#5CA690'
      v1: '#5CA690'
    }
    400: {
      DEFAULT: '#4E9784'
      v1: '#2E886F'
    }
    500: {
      DEFAULT: '#00694D'
      v1: '#00694D'
    }
    600: {
      DEFAULT: '#005B42'
      v1: '#005B42'
    }
    700: {
      DEFAULT: '#006045'
      v1: '#004C37'
    }
    800: {
      DEFAULT: '#003D2C'
      v1: '#003D2C'
    }
    900: {
      v1: '#002D20'
    }
  }
  malibu: {
    50: '#EBF1FF'
    100: '#D6E2FF'
    200: '#B5CAFF'
    300: '#7AA0FF'
    400: '#5887FF'
    500: '#527AF1'
    600: '#4B69DF'
    700: '#4052C7'
    800: '#3640A3'
    900: '#29307C'
  }
  red: {
    900: {
      DEFAULT: '#460118'
      v1: '#56000C'
    }
    800: {
      DEFAULT: '#6B0E2D'
      v1: '#740012'
    }
    700: {
      DEFAULT: '#821733'
      v1: '#920018'
    }
    600: {
      DEFAULT: '#A0253A'
      v1: '#AE001F'
    }
    500: {
      DEFAULT: '#C03643'
      v1: '#C90027'
    }
    400: {
      DEFAULT: '#E04A4B'
      v1: '#DB2E49'
    }
    300: {
      DEFAULT: '#F0938A'
      v1: '#E95C6D'
    }
    200: {
      DEFAULT: '#F5A491'
      v1: '#F48A93'
    }
    100: {
      DEFAULT: '#FAC9B8'
      v1: '#FBB8BC'
    }
    50: {
      DEFAULT: '#FDEBEE'
      v1: '#FFE6E6'
    }
    0: '#FDE7DA'
  }
  grey: {
    900: {
      DEFAULT: '#262626'
      v1: '#2B2C2C'
    }
    850: '#303030'
    800: {
      DEFAULT: '#3C3C3C'
      v1: '#424343'
    }
    750: '#454545'
    700: {
      DEFAULT: '#515151'
      v1: '#5A5B5B'
    }
    600: {
      DEFAULT: '#676767'
      v1: '#717272'
    }
    500: {
      DEFAULT: '#7D7D7D'
      v1: '#898A8A'
    }
    400: {
      DEFAULT: '#939393'
      v1: '#9E9F9F'
    }
    300: {
      DEFAULT: '#A8A8A8'
      v1: '#B3B4B4'
    }
    250: '#BEBEBE'
    200: {
      DEFAULT: '#D4D4D4'
      v1: '#C9C9C9'
    }
    150: '#E9E9E9'
    100: {
      DEFAULT: '#F4F4F4'
      v1: '#DEDEDE'
    }
    50: {
      DEFAULT: '#F9F9F9'
      v1: '#F3F3F3'
    }
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
    700: '#005A42'
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
  greenlight: {
    50: '#EFF8E9'
    100: '#D4EBC2'
    200: '#B8DB9D'
    300: '#9DCA7A'
    400: '#82B759'
    500: '#67A23A'
    600: '#578B30'
    700: '#487426'
    800: '#385C1D'
    900: '#294414'
  }
  overlaymain: {
    10: 'rgba(19, 20, 20, 0.1)'
    20: 'rgba(19, 20, 20, 0.2)'
    30: 'rgba(19, 20, 20, 0.3)'
    40: 'rgba(19, 20, 20, 0.4)'
    50: 'rgba(19, 20, 20, 0.5)'
    60: 'rgba(19, 20, 20, 0.6)'
    70: 'rgba(19, 20, 20, 0.7)'
    80: 'rgba(19, 20, 20, 0.8)'
    90: 'rgba(19, 20, 20, 0.9)'
  }
  overlayinverse: {
    10: 'rgba(250, 252, 252, 0.1)'
    20: 'rgba(250, 252, 252, 0.2)'
    30: 'rgba(250, 252, 252, 0.3)'
    40: 'rgba(250, 252, 252, 0.4)'
    50: 'rgba(250, 252, 252, 0.5)'
    60: 'rgba(250, 252, 252, 0.6)'
    70: 'rgba(250, 252, 252, 0.7)'
    80: 'rgba(250, 252, 252, 0.8)'
    90: 'rgba(250, 252, 252, 0.9)'
  }
}

const colors: Colors = {
  pink: {
    50: {
      DEFAULT: defaultColors.pink[50],
      v1: '#FEE6F4',
    },
    100: {
      DEFAULT: defaultColors.pink[100],
      v1: '#F9B8DF',
    },
    200: {
      DEFAULT: defaultColors.pink[200],
      v1: '#F28ACA',
    },
    300: {
      DEFAULT: defaultColors.pink[300],
      v1: '#E75EB4',
    },
    400: {
      DEFAULT: defaultColors.pink[400],
      v1: '#D8389D',
    },
    500: {
      DEFAULT: defaultColors.pink[500],
      v1: '#C71585',
    },
    600: {
      DEFAULT: defaultColors.pink[600],
      v1: '#AC0F72',
    },
    700: {
      DEFAULT: defaultColors.pink[700],
      v1: '#900A5E',
    },
    800: {
      DEFAULT: defaultColors.pink[800],
      v1: '#73064B',
    },
    900: {
      DEFAULT: defaultColors.pink[900],
      v1: '#550337',
    },
  },
  blue: defaultColors.blue,
  purple: {
    50: {
      DEFAULT: defaultColors.purple[50],
      v1: '#F1E8F5',
    },
    100: {
      DEFAULT: defaultColors.purple[100],
      v1: '#D8C0E1',
    },
    200: {
      DEFAULT: defaultColors.purple[200],
      v1: '#BE9ACB',
    },
    300: {
      DEFAULT: defaultColors.purple[300],
      v1: '#A375B4',
    },
    400: {
      DEFAULT: defaultColors.purple[400],
      v1: '#88529C',
    },
    500: {
      DEFAULT: defaultColors.purple[500],
      v1: '#6C3082',
    },
    600: {
      DEFAULT: defaultColors.purple[600],
      v1: '#5C2870',
    },
    700: {
      DEFAULT: defaultColors.purple[700],
      v1: '#4D205D',
    },
    800: {
      DEFAULT: defaultColors.purple[800],
      v1: '#3D184A',
    },
    900: {
      DEFAULT: defaultColors.purple[900],
      v1: '#2C1136',
    },
  },
  white: '#FAFCFC',
  black: '#2B2C2C',
  cyan: {
    900: {
      DEFAULT: '#001C49',
      v1: '#004557',
    },
    800: {
      DEFAULT: '#08295F',
      v1: '#025D75',
    },
    700: {
      DEFAULT: '#0C3A75',
      v1: '#057693',
    },
    600: {
      DEFAULT: '#125290',
      v1: '#098DAF',
    },
    500: {
      DEFAULT: '#1C6DAC',
      v1: '#0EA4CB',
    },
    400: {
      DEFAULT: '#268CC8',
      v1: '#32B9DC',
    },
    300: {
      DEFAULT: '#57B4DF',
      v1: '#5CCCEA',
    },
    200: {
      DEFAULT: '#7AD1ED',
      v1: '#8ADDF4',
    },
    100: {
      DEFAULT: '#A8EAFA',
      v1: '#B8ECFB',
    },
    50: {
      DEFAULT: '#ECF8FB',
      v1: '#E6F9FF',
    },
    0: '#D4F7FD',
  },
  yellow: {
    900: {
      DEFAULT: '#423201',
      v1: '#5D4300',
    },
    800: {
      DEFAULT: '#74500E',
      v1: '#7E5C00',
    },
    700: {
      DEFAULT: '#866729',
      v1: '#9D7300',
    },
    600: {
      DEFAULT: '#A8863A',
      v1: '#BC8A00',
    },
    500: {
      DEFAULT: '#C9A74C',
      v1: '#D9A100',
    },
    400: {
      DEFAULT: '#F2C94C',
      v1: '#E9B62E',
    },
    300: {
      DEFAULT: '#F3DB86',
      v1: '#F5CA5C',
    },
    200: {
      DEFAULT: '#F7E69D',
      v1: '#FDDB8A',
    },
    100: {
      DEFAULT: '#FBF0BE',
      v1: '#FFEBB8',
    },
    50: {
      DEFAULT: '#FEF9EB',
      v1: '#FFF8E6',
    },
    0: '#FEF9DB',
  },
  red: {
    900: {
      DEFAULT: '#460118',
      v1: '#56000C',
    },
    800: {
      DEFAULT: '#6B0E2D',
      v1: '#740012',
    },
    700: {
      DEFAULT: '#821733',
      v1: '#920018',
    },
    600: {
      DEFAULT: '#A0253A',
      v1: '#AE001F',
    },
    500: {
      DEFAULT: '#C03643',
      v1: '#C90027',
    },
    400: {
      DEFAULT: '#E04A4B',
      v1: '#DB2E49',
    },
    300: {
      DEFAULT: '#F0938A',
      v1: '#E95C6D',
    },
    200: {
      DEFAULT: '#F5A491',
      v1: '#F48A93',
    },
    100: {
      DEFAULT: '#FAC9B8',
      v1: '#FBB8BC',
    },
    50: {
      DEFAULT: '#FDEBEE',
      v1: '#FFE6E6',
    },
    0: '#FDE7DA',
  },
  grey: {
    900: {
      DEFAULT: '#262626',
      v1: '#2B2C2C',
    },
    850: '#303030',
    800: {
      DEFAULT: '#3C3C3C',
      v1: '#424343',
    },
    750: '#454545',
    700: {
      DEFAULT: '#515151',
      v1: '#5A5B5B',
    },
    600: {
      DEFAULT: '#676767',
      v1: '#717272',
    },
    500: {
      DEFAULT: '#7D7D7D',
      v1: '#898A8A',
    },
    400: {
      DEFAULT: '#939393',
      v1: '#9E9F9F',
    },
    300: {
      DEFAULT: '#A8A8A8',
      v1: '#B3B4B4',
    },
    250: '#BEBEBE',
    200: {
      DEFAULT: '#D4D4D4',
      v1: '#C9C9C9',
    },
    150: '#E9E9E9',
    100: {
      DEFAULT: '#F4F4F4',
      v1: '#DEDEDE',
    },
    50: {
      DEFAULT: '#F9F9F9',
      v1: '#F3F3F3',
    },
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
  green: {
    900: {
      v1: '#002D20',
    },
    800: {
      DEFAULT: '#003D2C',
      v1: '#003D2C',
    },
    700: {
      DEFAULT: '#006045',
      v1: '#004C37',
    },
    600: {
      DEFAULT: '#005B42',
      v1: '#005B42',
    },
    500: {
      DEFAULT: '#00694D',
      v1: '#00694D',
    },
    400: {
      DEFAULT: '#4E9784',
      v1: '#2E886F',
    },
    300: {
      DEFAULT: '#5CA690',
      v1: '#5CA690',
    },
    200: {
      DEFAULT: '#9CC5BA',
      v1: '#8AC1B1',
    },
    100: {
      DEFAULT: '#B8DBD0',
      v1: '#B8DBD0',
    },
    50: {
      DEFAULT: '#f0f8f5',
      v1: '#E6F3EE',
    },
  },
  malibu: {
    50: '#EBF1FF',
    100: '#D6E2FF',
    200: '#B5CAFF',
    300: '#7AA0FF',
    400: '#5887FF',
    500: '#527AF1',
    600: '#4B69DF',
    700: '#4052C7',
    800: '#3640A3',
    900: '#29307C',
  },
  forestgreen: {
    800: '#1D401D',
    700: '#005A42',
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
  greenlight: {
    50: '#EFF8E9',
    100: '#D4EBC2',
    200: '#B8DB9D',
    300: '#9DCA7A',
    400: '#82B759',
    500: '#67A23A',
    600: '#578B30',
    700: '#487426',
    800: '#385C1D',
    900: '#294414',
  },
  overlaymain: {
    10: 'rgba(19, 20, 20, 0.1)',
    20: 'rgba(19, 20, 20, 0.2)',
    30: 'rgba(19, 20, 20, 0.3)',
    40: 'rgba(19, 20, 20, 0.4)',
    50: 'rgba(19, 20, 20, 0.5)',
    60: 'rgba(19, 20, 20, 0.6)',
    70: 'rgba(19, 20, 20, 0.7)',
    80: 'rgba(19, 20, 20, 0.8)',
    90: 'rgba(19, 20, 20, 0.9)',
  },
  overlayinverse: {
    10: 'rgba(250, 252, 252, 0.1)',
    20: 'rgba(250, 252, 252, 0.2)',
    30: 'rgba(250, 252, 252, 0.3)',
    40: 'rgba(250, 252, 252, 0.4)',
    50: 'rgba(250, 252, 252, 0.5)',
    60: 'rgba(250, 252, 252, 0.6)',
    70: 'rgba(250, 252, 252, 0.7)',
    80: 'rgba(250, 252, 252, 0.8)',
    90: 'rgba(250, 252, 252, 0.9)',
  },
}

export default colors
