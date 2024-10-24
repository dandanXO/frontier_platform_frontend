import type { DefaultColors } from 'tailwindcss/types/generated/colors'
import defaultColors from 'tailwindcss/colors'

export interface Colors {
  pink: DefaultColors['pink']
  blue: DefaultColors['blue']
  purple: DefaultColors['purple']
  white: '#FAFCFC'
  black: '#131414'
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
    50: '#ECF8FB'
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
    50: '#FEF9EB'
    0: '#FEF9DB'
  }
  green: {
    50: '#f0f8f5'
    100: '#B8DBD0'
    200: {
      DEFAULT: '#9CC5BA'
      v1: '#8AC1B1'
    }
    300: '#5CA690'
    400: {
      DEFAULT: '#4E9784'
      v1: '#2E886F'
    }
    500: '#00694D'
    600: '#005B42'
    700: {
      DEFAULT: '#006045'
      v1: '#004C37'
    }
    800: '#003D2C'
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
    600: '#A0253A'
    500: {
      DEFAULT: '#C03643'
      v1: '#C90027'
    }
    400: {
      DEFAULT: '#E04A4B'
      v1: '#DB2E49'
    }
    300: '#F0938A'
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
      v1: '#131414'
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
    600: '#676767'
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
    200: '#D4D4D4'
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
}

const colors: Colors = {
  pink: defaultColors.pink,
  blue: defaultColors.blue,
  purple: defaultColors.purple,
  white: '#FAFCFC',
  black: '#131414',
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
    50: '#ECF8FB',
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
    50: '#FEF9EB',
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
    600: '#A0253A',
    500: {
      DEFAULT: '#C03643',
      v1: '#C90027',
    },
    400: {
      DEFAULT: '#E04A4B',
      v1: '#DB2E49',
    },
    300: '#F0938A',
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
      v1: '#131414',
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
    600: '#676767',
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
    200: '#D4D4D4',
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
    800: '#003D2C',
    700: {
      DEFAULT: '#006045',
      v1: '#004C37',
    },
    600: '#005B42',
    500: '#00694D',
    400: {
      DEFAULT: '#4E9784',
      v1: '#2E886F',
    },
    300: '#5CA690',
    200: {
      DEFAULT: '#9CC5BA',
      v1: '#8AC1B1',
    },
    100: '#B8DBD0',
    50: '#f0f8f5',
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
}

export default colors
