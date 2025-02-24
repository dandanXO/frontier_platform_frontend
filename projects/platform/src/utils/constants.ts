export * from '@frontier/constants'
import i18n from '@frontier/i18n'
import { computed } from 'vue'
import { WeightUnit, Extension, MaterialType } from '@frontier/platform-web-sdk'
import { getEnumTextValueMap } from '@/utils/mapping'

export const ROLE_ID = {
  OWNER: 1, // in use
  ADMIN: 2,
  MANAGER: 3,
  MEMBER1: 4, // in use
  MEMBER2: 5,
  MEMBER3: 6,
  GUEST: 7, // in use
}

export const INVALID_IMAGE_CODE = {
  INVALID_DIMENSION: 1,
  INVALID_FILE_SIZE: 2,
  INVALID_FILE_TYPE: 3,
  INVALID_RESOLUTION: 4,
} as const

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

export enum HOLE_TYPE {
  BLACK = 0,
  WHITE = 1,
}

export const MODAL_TYPE = {
  MODAL: 0,
  FULLSCREEN: 1,
  LOADING: 2,
  CONFIRM: 3,
  BEHAVIOR: 4,
  COMMON: 5,
}

export const SIDE_TYPE = {
  FACE: 1,
  BACK: 2,
}

export const INVENTORY_UNIT = {
  Y: 'Y',
  M: 'M',
  KG: 'KG',
  PCS: 'PCS',
}

export const MATERIAL_PRICING_CURRENCY = {
  USD: 'USD',
  RMB: 'RMB',
  TWD: 'TWD',
}

export const IMAGE_FILE_ACCEPT_TYPE: Array<Extension> = [
  Extension.JPEG,
  Extension.JPG,
  Extension.PNG,
]
export const VIDEO_FILE_ACCEPT_TYPE: Array<Extension> = [
  Extension.MOV,
  Extension.MP4,
]

export const CROP_FILE_ACCEPT_TYPE: Array<Extension> = [
  ...IMAGE_FILE_ACCEPT_TYPE,
  Extension.MOV,
  Extension.MP4,
  Extension.GIF,
]

export const ATTACHMENT_FILE_ACCEPT_TYPE: Array<Extension> = [
  ...IMAGE_FILE_ACCEPT_TYPE,
  ...VIDEO_FILE_ACCEPT_TYPE,
  Extension.PDF,
  Extension.GIF,
]

export const MATERIAL_FILE_ACCEPT_TYPE: Array<Extension> = [
  ...ATTACHMENT_FILE_ACCEPT_TYPE,
  Extension.ZIP,
  Extension.SCCH,
  Extension.YDT,
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
  DESIGNER: 4,
  FREE: 5,
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
  ASSET_CREATE: 11,
  ASSET_EDIT: 12,
  ASSET_DELETE: 13,
  ASSET_COPY: 14,
  ASSET_MERGE: 15,
  ASSET_ADD_TO_WORK_SPACE: 16,
  ASSET_SPREADSHEET: 17,
  ROUTER_ASSET_CREATED: 18,
  ROUTER_ASSET_EDIT: 19,
  WORKSPACE_CREATE_COLLECTION: 20,
  WORKSPACE_EDIT_COLLECTION: 21,
  WORKSPACE_DELETE_COLLECTION: 22,
  WORKSPACE_PUBLISH_COLLECTION: 23,
  WORKSPACE_DUPLICATE_COLLECTION: 24,
  WORKSPACE_MOVE_COLLECTION: 25,
  WORKSPACE_SHARE_COLLECTION: 26,
  PROGRESS_PAGE: 27,
  DASHBOARD_PAGE: 28,
  MANAGEMENT_ORG_EDIT: 29,
  MANAGEMENT_ORG_DELETE: 30,
  MANAGEMENT_GROUP_CREATE: 31,
  MANAGEMENT_GROUP_EDIT: 32,
  MANAGEMENT_GROUP_DELETE: 33,
  MANAGEMENT_MEMBER_INVITE: 34,
  MANAGEMENT_MEMBER_EDIT: 35,
  MANAGEMENT_MEMBER_DELETE: 36,
  ASSETS_3DVIEWER_EDIT: 37,
  ASSET_VIEW_INTTERNAL: 38,
}

const MEMBER3_PERMISSION_LIST = [FUNC_ID.VISIT_BILLING_PAGE]
const MEMBER2_PERMISSION_LIST = [FUNC_ID.VISIT_BILLING_PAGE]
const MEMBER1_PERMISSION_LIST = [
  FUNC_ID.ASSET_CREATE,
  FUNC_ID.ASSET_EDIT,
  FUNC_ID.ASSET_DELETE,
  FUNC_ID.ASSET_COPY,
  FUNC_ID.ASSET_MERGE,
  FUNC_ID.ASSET_ADD_TO_WORK_SPACE,
  FUNC_ID.ASSET_SPREADSHEET,
  FUNC_ID.ROUTER_ASSET_CREATED,
  FUNC_ID.ROUTER_ASSET_EDIT,
  FUNC_ID.WORKSPACE_CREATE_COLLECTION,
  FUNC_ID.WORKSPACE_EDIT_COLLECTION,
  FUNC_ID.WORKSPACE_DELETE_COLLECTION,
  FUNC_ID.WORKSPACE_PUBLISH_COLLECTION,
  FUNC_ID.WORKSPACE_DUPLICATE_COLLECTION,
  FUNC_ID.WORKSPACE_MOVE_COLLECTION,
  FUNC_ID.WORKSPACE_SHARE_COLLECTION,
  FUNC_ID.PROGRESS_PAGE,
  FUNC_ID.ASSETS_3DVIEWER_EDIT,
  FUNC_ID.ASSET_VIEW_INTTERNAL,
]
const GUEST_PERMISSION_LIST = [] // not have any permission

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
  FUNC_ID.ASSET_CREATE,
  FUNC_ID.ASSET_EDIT,
  FUNC_ID.ASSET_DELETE,
  FUNC_ID.ASSET_COPY,
  FUNC_ID.ASSET_MERGE,
  FUNC_ID.ASSET_ADD_TO_WORK_SPACE,
  FUNC_ID.ASSET_SPREADSHEET,
  FUNC_ID.ROUTER_ASSET_CREATED,
  FUNC_ID.ROUTER_ASSET_EDIT,
  FUNC_ID.WORKSPACE_CREATE_COLLECTION,
  FUNC_ID.WORKSPACE_EDIT_COLLECTION,
  FUNC_ID.WORKSPACE_DELETE_COLLECTION,
  FUNC_ID.WORKSPACE_PUBLISH_COLLECTION,
  FUNC_ID.WORKSPACE_DUPLICATE_COLLECTION,
  FUNC_ID.WORKSPACE_MOVE_COLLECTION,
  FUNC_ID.WORKSPACE_SHARE_COLLECTION,
  FUNC_ID.PROGRESS_PAGE,
  FUNC_ID.DASHBOARD_PAGE,
  FUNC_ID.MANAGEMENT_ORG_EDIT,
  FUNC_ID.MANAGEMENT_ORG_DELETE,
  FUNC_ID.MANAGEMENT_GROUP_CREATE,
  FUNC_ID.MANAGEMENT_GROUP_EDIT,
  FUNC_ID.MANAGEMENT_GROUP_DELETE,
  FUNC_ID.MANAGEMENT_MEMBER_INVITE,
  FUNC_ID.MANAGEMENT_MEMBER_EDIT,
  FUNC_ID.MANAGEMENT_MEMBER_DELETE,
  FUNC_ID.ASSETS_3DVIEWER_EDIT,
  FUNC_ID.ASSET_VIEW_INTTERNAL,
]

const OWNER_PERMISSION_LIST = [...ADMIN_PERMISSION_LIST, FUNC_ID.DELETE_ORG]

export const PERMISSION_MAP = {
  [ROLE_ID.OWNER]: OWNER_PERMISSION_LIST,
  [ROLE_ID.ADMIN]: ADMIN_PERMISSION_LIST,
  [ROLE_ID.MANAGER]: MANAGER_PERMISSION_LIST,
  [ROLE_ID.MEMBER1]: MEMBER1_PERMISSION_LIST,
  [ROLE_ID.MEMBER2]: MEMBER2_PERMISSION_LIST,
  [ROLE_ID.MEMBER3]: MEMBER3_PERMISSION_LIST,
  [ROLE_ID.GUEST]: GUEST_PERMISSION_LIST,
}

export const MOODBOARD_TYPE = {
  DEMANDER: 1,
  PROVIDER: 2,
}

export enum PROGRESS_TAB {
  MATERIAL = 'material',
  U3M = 'u3m',
  EXCEL = 'excel',
  SPREADSHEET = 'spreadsheet',
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
  STARTRUST: 'starTrust',
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

  const TEMPLATE_LIST = computed(() => [
    {
      title: i18n.global.t('RR0091'),
      type: 'Woven',
    },
    {
      title: i18n.global.t('RR0092'),
      type: 'Knit',
    },
    {
      title: i18n.global.t('MI0018'),
      type: 'Leather',
    },
    {
      title: i18n.global.t('MI0020'),
      type: 'Non-Woven',
    },
    {
      title: i18n.global.t('MI0021'),
      type: 'Trims',
    },
    {
      title: i18n.global.t('MI0022'),
      type: 'Others',
    },
  ])

  const CROPPER_GRID_COLORS = [
    {
      color: '#FFFFFF',
      invertContent: true,
      text: i18n.global.t('EE0199'),
    },
    {
      color: '#111111',
      invertContent: false,
      text: i18n.global.t('EE0200'),
    },
    {
      color: '#FF4F00',
      invertContent: false,
      text: i18n.global.t('EE0227'),
    },
    {
      color: '#FCF75E',
      invertContent: true,
      text: i18n.global.t('EE0228'),
    },
    {
      color: '#55DD33',
      invertContent: false,
      text: i18n.global.t('EE0229'),
    },
    {
      color: '#318CE7',
      invertContent: false,
      text: i18n.global.t('EE0230'),
    },
  ]

  return {
    MADE2FLOW_TAG_LIST,
    FEEDBACK_CATEGORY,
    WEIGHT_UNIT,
    TEMPLATE_LIST,
    CROPPER_GRID_COLORS,
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

export const WITH_CONSTRUCTION_TYPE_MATERIALS = [
  MaterialType.WOVEN,
  MaterialType.KNIT,
] as MaterialType[]

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

export const fileCardDragOptions = {
  itemKey: 'id',
  forceFallback: true,
  scrollSensitivity: 40,
  scrollSpeed: 7,
  animation: 250,
  disabled: false,
}

export enum SHARE_WITH_TYPE {
  OG = 1,
  USER = 2,
}

export enum OUTER_TYPE {
  RECEIVED_SHARE = 1,
  EMBED = 2,
  ASSETS = 3,
}

const PrintLabelSettingMaterialTypeCommonOptions = [
  { label: i18n.global.t('MI0003'), value: 'isPrintMaterialType' },
  { label: i18n.global.t('MI0023'), value: 'isPrintMaterialDescription' },
]

export const PrintLabelSettingMaterialType = [
  {
    key: i18n.global.t('RR0091'),
    options: [
      ...PrintLabelSettingMaterialTypeCommonOptions,
      { label: i18n.global.t('MI0027'), value: 'isPrintDensity' },
      { label: i18n.global.t('RR0023'), value: 'isPrintYarnSize' },
    ],
    dataKey: 'wovenOptions',
  },
  {
    key: i18n.global.t('RR0092'),
    options: [
      ...PrintLabelSettingMaterialTypeCommonOptions,
      { label: i18n.global.t('MI0031'), value: 'isPrintMachineType' },
      { label: i18n.global.t('RR0023'), value: 'isPrintYarnSize' },
      { label: i18n.global.t('MI0032'), value: 'isPrintWales' },
      { label: i18n.global.t('MI0033'), value: 'isPrintCourses' },
      { label: i18n.global.t('MI0068'), value: 'isPrintMachineGauge' },
    ],
    dataKey: 'knitOptions',
  },
  {
    key: `${i18n.global.t('MI0018')}/${i18n.global.t('MI0019')}`,
    options: [
      ...PrintLabelSettingMaterialTypeCommonOptions,
      { label: i18n.global.t('MI0072'), value: 'isPrintGrade' },
      { label: i18n.global.t('MI0073'), value: 'isPrintTannage' },
      { label: i18n.global.t('MI0071'), value: 'isPrintAverageSkinHideSize' },
      { label: i18n.global.t('MI0074'), value: 'isPrintThickness' },
    ],
    dataKey: 'leatherOptions',
  },
  {
    key: i18n.global.t('MI0020'),
    options: [
      ...PrintLabelSettingMaterialTypeCommonOptions,
      { label: i18n.global.t('MI0078'), value: 'isPrintBondingMethod' },
      { label: i18n.global.t('MI0074'), value: 'isPrintThickness' },
    ],
    dataKey: 'nonwovenOptions',
  },
  {
    key: i18n.global.t('MI0021'),
    options: [
      ...PrintLabelSettingMaterialTypeCommonOptions,
      { label: i18n.global.t('MI0079'), value: 'isPrintTrimDiameter' },
      { label: i18n.global.t('MI0080'), value: 'isPrintTrimLength' },
      { label: i18n.global.t('MI0081'), value: 'isPrintTrimThickness' },
      { label: i18n.global.t('MI0082'), value: 'isPrintTrimWidth' },
    ],
    dataKey: 'trimOptions',
  },
  {
    key: i18n.global.t('TT0164'),
    options: [...PrintLabelSettingMaterialTypeCommonOptions],
    dataKey: 'otherOptions',
  },
]

export const PrintLabelSettingMaterialInformation = {
  options: [
    { label: i18n.global.t('MI0014'), value: 'isPrintFeature' },
    { label: i18n.global.t('RR0381'), value: 'isPrintWidth' },
    { label: i18n.global.t('RR0021'), value: 'isPrintContent' },
    { label: i18n.global.t('RR0022'), value: 'isPrintFinish' },
    { label: i18n.global.t('RR0026'), value: 'isPrintColor' },
    { label: i18n.global.t('RR0025'), value: 'isPrintPattern' },
  ],
  dataKey: 'materialInfoOptions',
}

export const PrintLabelSettingEcoImpactor = {
  options: [
    { label: i18n.global.t('MM0044'), value: 'isPrintGHG' },
    { label: i18n.global.t('RR0222'), value: 'isPrintWaterDepletion' },
    { label: i18n.global.t('RR0224'), value: 'isPrintLandUse' },
    { label: i18n.global.t('BB0142'), value: 'isPrintCapturedTime' },
  ],
  dataKey: 'ecoImpactorOptions',
}

export const PrintLabelSettingBasicInfo = {
  options: [
    { label: i18n.global.t('OO0022'), value: 'isPrintOrgName' },
    { label: i18n.global.t('RR0084'), value: 'isPrintFrontierNo' },
  ],
  dataKey: 'materialInfoOptions',
}

export const MIN_DIMENSION_2D_MATERIAL = 800
