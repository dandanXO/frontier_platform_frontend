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
  LOADING: 2,
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
    value: 1
  },
  WITH_U3M: {
    text: i18n.global.t('RR0100'),
    value: 2
  },
  WITHOUT_U3M: {
    text: i18n.global.t('RR0101'),
    value: 3
  },
  NO_SCAN_IMG: {
    text: i18n.global.t('RR0102'),
    value: 4
  },
  NO_IMG: {
    text: i18n.global.t('RR0103'),
    value: 5
  },
  WITH_REQUIRED_FIELDS: {
    text: i18n.global.t('RR0104'),
    value: 6
  }
}

/**
 * 1. 關聯度 Relevance：照分數高至低排名
 * 2. 關聯度 Relevance (資料夾優先 Collections to fabrics)：資料夾排前，布片排後，照分數高至低排名
 * 3. 關聯度 Relevance (布片優先 Fabrics to collections)：布片排前，資料夾排後，照分數高至低排名
 * 4. 字母順序 A to Z
 * 5. 字母順序 A to Z (資料夾優先 Collections to fabrics)：資料夾排前，布片排後，按照字母順序(A to Z)
 * 6. 字母順序 A to Z (布片優先 Fabrics to collections)：布片排前，資料夾排後，按照字母順序(A to Z)
 * 7. 建立時間：最新建立的排前
 * 8. 建立時間 Created date (資料夾優先 Collections to fabrics)：資料夾排前，布片排後，最新建立的排前
 * 9. 建立時間 Created date (布片優先 Fabrics to collections)：布片排前，資料夾排後，最新建立的排前
 * 10. 最新加入 (New arrived)：最新加入的排前
 * 11. 最新更新：最新更新的排前，布料編輯所做的任何更動即為更新
 * 12. 隨機排序 (Random)：隨機重新排序
 */
export const SORT_BY = {
  RELEVANCE: {
    text: i18n.global.t('RR0070'),
    value: 1
  },
  RELEVANCE_C_M: {
    text: i18n.global.t('RR0114'),
    value: 2
  },
  RELEVANCE_M_C: {
    text: i18n.global.t('RR0115'),
    value: 3
  },
  MATERIAL_NO_A_Z: {
    text: i18n.global.t('RR0067'),
    value: 4
  },
  MATERIAL_NO_A_Z_C_M: {
    text: i18n.global.t('RR0110'),
    value: 5
  },
  MATERIAL_NO_A_Z_M_C: {
    text: i18n.global.t('RR0111'),
    value: 6
  },
  CREATE_DATE: {
    text: i18n.global.t('RR0065'),
    value: 7
  },
  CREATE_DATE_C_M: {
    text: i18n.global.t('RR0112'),
    value: 8
  },
  CREATE_DATE_M_C: {
    text: i18n.global.t('RR0113'),
    value: 9
  },
  NEW_ARRIVED: {
    text: i18n.global.t('RR0129'),
    value: 10
  },
  LAST_UPDATE: {
    text: i18n.global.t('RR0066'),
    value: 11
  },
  RANDOM: {
    text: i18n.global.t('RR0128'),
    value: 12
  }
}

export const TARGET_LOCATION = {
  ORG: 1,
  GROUP: 2
}

export const NODE_LOCATION = {
  ORG: 1,
  GROUP: 2
}

export const SOURCE_ASSET_LOCATION = {
  ORG: 1,
  GROUP: 2
}

export const NODE_TYPE = {
  MATERIAL: 1,
  COLLECTION: 2
}

export const SEARCH_TYPE = {
  ASSETS: 1,
  WORKSPACE: 2,
  PUBLIC_LIBRARY: 3
}

export const DISPLAY_NODE = {
  LIST: 1,
  GRID: 2
}
