export * from '@frontier/constants'
import i18n from '@frontier/i18n'
import { computed } from 'vue'
import colors from '@frontier/tailwindcss/colors'
import { WeightUnit } from '@frontier/platform-web-sdk'
import { getEnumTextValueMap } from '@/utils/mapping'
import { EXTENSION } from '@frontier/constants'

export const ROLE_ID = {
  OWNER: 1,
  ADMIN: 2,
  MANAGER: 3,
  MEMBER1: 4,
  MEMBER2: 5,
  MEMBER3: 6,
}

export const COLOR = {
  RED: '#E04A4B',
  LAVA: '#F07D73',
  ORANGE: '#F8A853',
  YELLOW: '#F2C94C',
  LIGHTGREEN: '#8BC34A',
  DARKGREEN: '#48A148',
  CYAN: '#2498A3',
  LIGHTBLUE: '#57B4DF',
  DARKBLUE: '#3B82F6',
  DARKPURPLE: '#A855F7',
  LIGHTPURPLE: '#D8B4FE',
  PINK: '#F472B6',
  BROWN: '#B48360',
  GREY: '#939393',
}

export const CROPPER_GRID_COLORS = [
  { color: colors.grey[900], invertContent: false },
  { color: colors.grey[0], invertContent: true },
  { color: '#F8BEB9', invertContent: false },
  { color: colors.yellow[100], invertContent: false },
  { color: '#C5E1A4', invertContent: false },
  { color: colors.cyan[100], invertContent: false },
  { color: colors.purple[100], invertContent: false },
  { color: colors.grey[600], invertContent: false },
  { color: colors.grey[300], invertContent: false },
  { color: colors.red[300], invertContent: false },
  { color: '#FAC187', invertContent: false },
  { color: colors.forestgreen[400], invertContent: false },
  { color: colors.blue[400], invertContent: false },
  { color: colors.purple[400], invertContent: false },
]

export const MODAL_TYPE = {
  MODAL: 0,
  FULLSCREEN: 1,
  LOADING: 2,
  CONFIRM: 3,
  BEHAVIOR: 4,
}

export const SIDE_TYPE = {
  FACE: 1,
  BACK: 2,
}

export const INVENTORY_UNIT = {
  Y: 'Y',
  M: 'M',
  KG: 'KG',
}

export const MATERIAL_PRICING_CURRENCY = {
  USD: 'USD',
  RMB: 'RMB',
  TWD: 'TWD',
}

export const MATERIAL_UPLOAD_FILE_ACCEPT_TYPE = [
  EXTENSION.PDF,
  EXTENSION.JPG,
  EXTENSION.JPEG,
  EXTENSION.PNG,
  EXTENSION.ZIP,
  EXTENSION.GIF,
  EXTENSION.MOV,
  EXTENSION.MP4,
  EXTENSION.SCCH,
  EXTENSION.YDT,
]

export const COVER_MODE = {
  FACE: 1,
  BACK: 2,
  SUP: 3,
}

export enum U3M_STATUS {
  UNQUALIFIED = -1,
  INITIAL = 0,
  IN_QUEUE = 1,
  COMPLETED = 2,
  PROCESSING = 3,
  UNSUCCESSFUL = 99,
}

export enum U3M_PROVIDER {
  FRONTIER = 1,
  CUSTOMER = 2,
}

export enum U3M_FILE_TYPE {
  U3M = 1,
  U3MA = 2,
  GLTF = 3,
}

export enum U3M_DOWNLOAD_PROP {
  U3M = 'zipUrl',
  U3MA = 'u3maUrl',
  GLTF = 'gltfUrl',
}
export const OG_TYPE = {
  ORG: 1,
  GROUP: 2,
}

export const NODE_TYPE = {
  COLLECTION: 1,
  MATERIAL: 2,
}

export enum SEARCH_TYPE {
  ASSETS = 1,
  WORKSPACE = 2,
  EXTERNAL = 5,
  INNER_EXTERNAL = 6,
}

export const DISPLAY_NODE = {
  LIST: 1,
  GRID: 2,
}

export enum ASSET_LIST_DISPLAY_MODE {
  LIST = 1,
  GRID = 2,
}

export const SHARING_FROM = {
  WORKSPACE: 1,
  PUBLIC_LIBRARY: 2,
}

export const RECEIVED_SHARE_ACTION_TYPE = {
  SAVE: 1,
  CLONE: 2,
  DOWNLOAD: 3,
}

export const PLAN_TYPE = {
  BASIC: 1,
  PRO: 2,
  ENT: 3,
}

export const PLAN_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  TRANSITION: 2,
  /**
   * 停用申請停用後到正式停用的過度期，舉例來說：
   * 使用者於 3/4 14:00 pm 申請停用，但這時還是訂閱中，其功能還是都可以操作，
   * 等到 3/5 00:00 am 後系統才會正式的停止訂閱，限制其功能，
   * 那麼 3/4 14:00 ~ 3/5: 00:00 am 就是所謂的過渡期。
   */ BUFFER: 4,
}

export const BILLING_CATEGORY = {
  ALL: 0,
  SUBSCRIPTION: 1,
  U3M: 2,
}

export const BILLING_SORT = {
  NEWEST_FIRST: 1,
  OLDEST_FIRST: 2,
}

export const FUNC_ID = {
  OPEN_MANAGE_MATERIAL_QUOTA: 1,
  OPEN_PURCHASE_U3M: 2,
  VISIT_BILLING_PAGE: 3,
  OPEN_CREATE_GROUP: 4,
  DELETE_ORG: 5,
  CREATE_WORKFLOW_STAGE: 6,
  EDIT_WORKFLOW_STAGE: 7,
  DELETE_WORKFLOW_STAGE: 8,
  MOVE_WORKFLOW_STAGE: 9,
  HIDE_SHOW_WORKFLOW_STAGE: 10,
}

const MEMBER3_PERMISSION_LIST = [FUNC_ID.VISIT_BILLING_PAGE]
const MEMBER2_PERMISSION_LIST = [FUNC_ID.VISIT_BILLING_PAGE]
const MEMBER1_PERMISSION_LIST = [FUNC_ID.VISIT_BILLING_PAGE]

const MANAGER_PERMISSION_LIST = [
  FUNC_ID.VISIT_BILLING_PAGE,
  FUNC_ID.HIDE_SHOW_WORKFLOW_STAGE,
]

const ADMIN_PERMISSION_LIST = [
  ...MANAGER_PERMISSION_LIST,
  FUNC_ID.OPEN_MANAGE_MATERIAL_QUOTA,
  FUNC_ID.OPEN_PURCHASE_U3M,
  FUNC_ID.VISIT_BILLING_PAGE,
  FUNC_ID.OPEN_CREATE_GROUP,
  FUNC_ID.CREATE_WORKFLOW_STAGE,
  FUNC_ID.EDIT_WORKFLOW_STAGE,
  FUNC_ID.DELETE_WORKFLOW_STAGE,
  FUNC_ID.MOVE_WORKFLOW_STAGE,
  FUNC_ID.HIDE_SHOW_WORKFLOW_STAGE,
]

const OWNER_PERMISSION_LIST = [...ADMIN_PERMISSION_LIST, FUNC_ID.DELETE_ORG]

export const PERMISSION_MAP = {
  [ROLE_ID.OWNER]: OWNER_PERMISSION_LIST,
  [ROLE_ID.ADMIN]: ADMIN_PERMISSION_LIST,
  [ROLE_ID.MANAGER]: MANAGER_PERMISSION_LIST,
  [ROLE_ID.MEMBER1]: MEMBER1_PERMISSION_LIST,
  [ROLE_ID.MEMBER2]: MEMBER2_PERMISSION_LIST,
  [ROLE_ID.MEMBER3]: MEMBER3_PERMISSION_LIST,
}

export const MOODBOARD_TYPE = {
  DEMANDER: 1,
  PROVIDER: 2,
}

export enum PROGRESS_TAB {
  MATERIAL = 'material',
  U3M = 'u3m',
  EXCEL = 'excel',
}

export enum MOODBOARD_TAB {
  OFFER = 'offer',
  PICKED = 'picked',
  COMMENT = 'comment',
}

export const MOODBOARD_OFFER_ID_ALL = -1

export const MADE2FLOW_PLAN_TYPE = {
  STANDARD: 1,
  PERSONALIZED: 2,
  PERSONALIZED_PRO: 3,
}

export const VALUE_ADDED_SERVICE_STATUS = {
  ACTIVATE: 1,
  EXPIRED: 2,
  CANCELED: 3,
  INVALID: 4,
}

export const VALUE_ADDED_SERVICE_ID = {
  MADE2FLOW: 'made2flow',
}

export const STICKER_ADD_TO = {
  ALL: 0,
  EXTERNAL: 1,
  INTERNAL: 2,
}

export enum PLATFORM_LOCATION_TYPE {
  INTERNAL = 1, // ASSETS, WORKSPACE
  EXTERNAL = 2, // PUBLIC, SHARE_TO_ME, MOODBOARD, RECEIVED_SHARE, EMBED, SHOWROOM
  INNER_EXTERNAL = 3, // PUBLIC, SHARE_TO_ME, MOODBOARD, SHOWROOM
  OUTER_EXTERNAL = 4, // RECEIVED_SHARE, EMBED
}

export enum MATERIAL_SIDE_TYPE {
  FACE = 1,
  MIDDLE = 2,
  BACK = 3,
}

export const SIGNUP_SOURCE = {
  NORMAL: 1,
  RECEIVED_SHARE: 2, // 從 Received share 的 add sticker 的跳轉而來的。
}

export const useConstants = () => {
  const MADE2FLOW_TAG_LIST = computed(() => ({
    INTRODUCTION: { id: 1, text: i18n.global.t('VV0022') },
    METHODOLOGY: { id: 2, text: i18n.global.t('RR0234') },
    FAQ: { id: 3, text: i18n.global.t('VV0024') },
    PLAN_AND_PRICE: { id: 4, text: i18n.global.t('VV0025') },
    APPOINTMENT: { id: 5, text: i18n.global.t('VV0026') },
  }))

  const FEEDBACK_CATEGORY = computed(() => ({
    BUG: {
      text: i18n.global.t('MM0010'),
      value: 1,
    },
    SUGGESTION: {
      text: i18n.global.t('MM0011'),
      value: 2,
    },
    PAYMENT: {
      text: i18n.global.t('OO0065'),
      value: 4,
    },
    CARBON_EMISSION: {
      text: i18n.global.t('MM0037'),
      value: 5,
    },
    OTHER: {
      text: i18n.global.t('MM0012'),
      value: 3,
    },
  }))

  const WEIGHT_UNIT = computed(() =>
    getEnumTextValueMap<typeof WeightUnit>(
      {
        [WeightUnit.GSM]: i18n.global.t('RR0016'),
        [WeightUnit.OZ]: i18n.global.t('RR0017'),
        [WeightUnit.GY]: i18n.global.t('RR0018'),
        [WeightUnit.GM]: 'g/m',
      },
      WeightUnit
    )
  )

  return {
    MADE2FLOW_TAG_LIST,
    FEEDBACK_CATEGORY,
    WEIGHT_UNIT,
  }
}

export enum CROP_MODE {
  SQUARE = 'square',
  PERSPECTIVE = 'perspective',
}

export enum U3M_CUT_SIDE {
  FACE_SIDE = 'faceSide',
  BACK_SIDE = 'backSide',
}

export enum U3M_CUT_SIDE_EDIT_STATE {
  EDITED = 'edited',
  CURRENT = 'current',
  NEXT = 'next',
  DISABLED = 'disabled',
}

export enum CONTENT_PARSED_TYPE {
  URL = 1,
  STICKER = 2,
  NEWLINE = 3,
}

export enum CREATE_EDIT {
  CREATE = 1,
  EDIT = 2,
}

export const COLLECTION_NAME_MAX_LENGTH = 100
export const COLLECTION_DESCRIPTION_MAX_LENGTH = 1000

export const CUSTOM_3D_VIEWER_MODEL_ORG_ID = 1713

export const materialFormServiceKey = Symbol('MaterialFormService')
export const materialU3mSelectServiceKey = Symbol('MaterialU3mSelectService')
export const materialMultimediaCreateServiceKey = Symbol(
  'MaterialMultimediaCreateService'
)
export const materialMultimediaUpdateServiceKey = Symbol(
  'MaterialMultimediaUpdateService'
)
export const materialAttachmentCreateServiceKey = Symbol(
  'MaterialAttachmentCreateService'
)
export const materialAttachmentUpdateServiceKey = Symbol(
  'MaterialAttachmentUpdateService'
)
