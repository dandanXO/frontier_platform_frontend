import i18n from '@/utils/i18n'

export const ROLE_ID = {
  OWNER: 1,
  ADMIN: 2,
  MANAGER: 3,
  MEMBER1: 4,
  MEMBER2: 5,
  MEMBER3: 6
}

export const COLOR = {
  RED: '#D3242A',
  LAVA: '#EE695E',
  ORANGE: '#FAA62A',
  YELLOW: '#FED402',
  LIGHTGREEN: '#61C554',
  DARKGREEN: '#139613',
  CYAN: '#00CEB4',
  LIGHTBLUE: '#18AAFD',
  DARKBLUE: '#0369DA',
  DARKPURPLE: '#7B61FF',
  LIGHTPURPLE: '#CD9BFF',
  PINK: '#FF79B9',
  BROWN: '#964800',
  GRAY: '#616161'
}

export const MODAL_TYPE = {
  MODAL: 0,
  FULLSCREEN: 1,
  CONFIRM: 3
}

export const SIDE_TYPE = {
  FACE: 1,
  BACK: 2
}

export const WEIGHT_UNIT = {
  GSM: 1,
  OZ: 2
}

export const INVENTORY_UNIT = {
  Y: 'Y',
  M: 'M',
  KG: 'KG'
}

export const MATERIAL_PRICING_CURRENCY = {
  USD: 'USD',
  RMB: 'RMB',
  TWD: 'TWD'
}

export const COVER_MODE = {
  FACE: 1,
  BACK: 2,
  SUP: 3
}

export const U3M_STATUS = {
  UNQUALIFIED: -1,
  INITIAL: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  FAIL: 99
}

export const FILTER_COMPLETE = {
  NOT_IN_WORKSPACE: {
    text: i18n.global.t('RR0099'),
    code: 1
  },
  WITH_U3M: {
    text: i18n.global.t('RR0100'),
    code: 2
  },
  WITHOUT_U3M: {
    text: i18n.global.t('RR0101'),
    code: 3
  },
  NO_SCAN_IMG: {
    text: i18n.global.t('RR0102'),
    code: 4
  },
  NO_IMG: {
    text: i18n.global.t('RR0103'),
    code: 5
  },
  WITH_REQUIRED_FIELDS: {
    text: i18n.global.t('RR0104'),
    code: 6
  }
}
