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
  CONFIRM: 3,
  BEHAVIOR: 4
}

export const MODAL_CONFIRM_TYPE = {
  INFO: 0,
  WARNING: 1,
  SUCCESS: 2,
  ALERT: 3
}

export const SIDE_TYPE = {
  FACE: 1,
  BACK: 2
}

export const WEIGHT_UNIT = {
  GSM: {
    text: i18n.global.t('RR0016'),
    value: 1
  },
  OZ: {
    text: i18n.global.t('RR0017'),
    value: 2
  }
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
  IN_QUEUE: 1,
  COMPLETED: 2,
  PROCESSING: 3,
  UNSUCCESSFUL: 99
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
  COLLECTION: 1,
  MATERIAL: 2
}

export const SEARCH_TYPE = {
  ASSETS: 1,
  WORKSPACE: 2,
  PUBLIC_LIBRARY: 3,
  SHARE: 4
}

export const DISPLAY_NODE = {
  LIST: 1,
  GRID: 2
}

export const FEEDBACK_CATEGORY = {
  BUG: {
    text: i18n.global.t('MM0010'),
    value: 1
  },
  SUGGESTION: {
    text: i18n.global.t('MM0011'),
    value: 2
  },
  PAYMENT: {
    text: i18n.global.t('OO0065'),
    value: 4
  },
  OTHER: {
    text: i18n.global.t('MM0012'),
    value: 3
  },
}

export const SHARING_FROM = {
  WORKSPACE: 1,
  PUBLIC_LIBRARY: 2
}

export const RECEIVED_SHARE_ACTION_TYPE = {
  SAVE: 1,
  CLONE: 2,
  DOWNLOAD: 3
}

export const SHARE_TARGET_TYPE = {
  ORG: 1,
  GROUP: 2,
  EMAIL: 3
}

export const PLAN_TYPE = {
  BASIC: 1,
  PRO: 2,
  ENT: 3
}

export const PLAN_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  TRANSITION: 2
  /**
   * 停用申請停用後到正式停用的過度期，舉例來說：
   * 使用者於 3/4 14:00 pm 申請停用，但這時還是訂閱中，其功能還是都可以操作，
   * 等到 3/5 00:00 am 後系統才會正式的停止訂閱，限制其功能，
   * 那麼 3/4 14:00 ~ 3/5: 00:00 am 就是所謂的過渡期。
   */,
  BUFFER: 4
}

export const BILLING_CATEGORY = {
  ALL: 0,
  SUBSCRIPTION: 1,
  U3M: 2
}

export const BILLING_SORT = {
  NEWEST_FIRST: 1,
  OLDEST_FIRST: 2
}


export const FUNC_ID = {
  OPEN_MANAGE_MATERIAL_QUOTA: 1,
  OPEN_PURCHASE_U3M: 2,
  VISIT_BILLING_PAGE: 3,
  OPEN_CREATE_GROUP: 4,
  DELETE_ORG: 5
}

const MEMBER3_PERMISSION_LIST = [
]
const MEMBER2_PERMISSION_LIST = [
]
const MEMBER1_PERMISSION_LIST = [
]
const MANAGER_PERMISSION_LIST = [
]

const ADMIN_PERMISSION_LIST = [
  ...MANAGER_PERMISSION_LIST,
  FUNC_ID.OPEN_MANAGE_MATERIAL_QUOTA,
  FUNC_ID.OPEN_PURCHASE_U3M,
  FUNC_ID.VISIT_BILLING_PAGE,
  FUNC_ID.OPEN_CREATE_GROUP
]

const OWNER_PERMISSION_LIST = [
  ...ADMIN_PERMISSION_LIST,
  FUNC_ID.DELETE_ORG
]

export const PERMISSION_MAP = {
  [ROLE_ID.OWNER]: OWNER_PERMISSION_LIST,
  [ROLE_ID.ADMIN]: ADMIN_PERMISSION_LIST,
  [ROLE_ID.MANAGER]: MANAGER_PERMISSION_LIST,
  [ROLE_ID.MEMBER1]: MEMBER1_PERMISSION_LIST,
  [ROLE_ID.MEMBER2]: MEMBER2_PERMISSION_LIST,
  [ROLE_ID.MEMBER3]: MEMBER3_PERMISSION_LIST
}

export const SOCIAL_MEDIA_TYPE = {
  LINKEDIN: 1,
  FACEBOOK: 2,
  TWITTER: 3
}

export const UPLOAD_ERROR_CODE = {
  INVALID_TYPE: 1,
  EXCEED_LIMIT: 2,
  TOO_SMALL: 3
}

export const UPLOAD_PROGRESS = {
  ALL: 0,
  IN_QUEUE: 1,
  PROCESSING: 2,
  UNSUCCESSFUL: 3,
  COMPLETE: 4,
  CANCELED: 5
}

/**
 * 1. 建立時間：最晚建立的排前
 * 2. 建立時間：最早建立的排前
 * 3. status (In Queue > Processing > Unsuccessful > Complete)
 * 4. status (Complete > Unsuccessful > Processing > In Queue)
 */
export const UPLOAD_PROGRESS_SORT_BY = {
  NEWEST_FIRST: 1,
  OLDEST_FIRST: 2,
  IN_QUEUE_FIRST: 3,
  COMPLETE_FIRST: 4
}


export const EXCEL_CATEGORY = {
  ALL: 0,
  UPLOAD: 1,
  EXPORT: 2
}

export const UPLOAD_PROGRESS_EXCEL_SORT_BY = {
  NEWEST_FIRST: 1,
  OLDEST_FIRST: 2,
  IN_QUEUE_FIRST: 3,
  COMPLETE_FIRST: 4,
  UPLOAD_FIRST: 5,
  EXPORT_FIRST: 6
}
