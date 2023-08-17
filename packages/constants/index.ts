/**
 * 0 - 不可選
 * 1 - 單選，可取消
 * 2 - 單選，不可取消
 * 3 - 多選
 */
export enum CONTEXTUAL_MENU_MODE {
  NONE_SELECT = 0,
  SINGLE_CANCEL = 1,
  SINGLE_NONE_CANCEL = 2,
  MULTIPLE = 3,
}

export enum UPLOAD_ERROR_CODE {
  INVALID_TYPE = 1,
  EXCEED_LIMIT = 2,
  TOO_SMALL = 3,
}

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum NOTIFY_TYPE {
  INFO = 0,
  WARNING = 1,
  SUCCESS = 2,
  ALERT = 3,
  TIPS = 4,
  CRITICAL = 5,
}

export const NOTIFY_TYPE_ICON = {
  [NOTIFY_TYPE.INFO]: 'error_outline',
  [NOTIFY_TYPE.WARNING]: 'error_outline',
  [NOTIFY_TYPE.SUCCESS]: 'check_circle_outline',
  [NOTIFY_TYPE.ALERT]: 'warning_amber_round',
  [NOTIFY_TYPE.TIPS]: 'new',
  [NOTIFY_TYPE.CRITICAL]: 'warning_amber_round',
}

export enum DISPLAY {
  BLOCK = 'block',
  FLEX = 'flex',
}

export enum SIZE {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum TOOLTIP_PLACEMENT {
  AUTO = 'auto',
  TOP = 'top',
  TOP_START = 'top-start',
  TOP_END = 'top-end',
  BOTTOM = 'bottom',
  BOTTOM_START = 'bottom-start',
  BOTTOM_END = 'bottom-end',
  RIGHT = 'right',
  RIGHT_START = 'right-start',
  RIGHT_END = 'right-end',
  LEFT = 'left',
  LEFT_START = 'left-start',
  LEFT_END = 'left-end',
}

export enum NATIVE_EXTENSION {
  XLSX = 'xlsx',
  ZIP = 'zip',
  PDF = 'pdf',
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  GIF = 'gif',
  MOV = 'mov',
  MP4 = 'mp4',
  JSON = 'json',
}

export enum CUSTOMIZED_EXTENSION {
  FOLDER = 'folder',
  U3M = 'u3m',
  SCCH = 'scch',
}

export const EXTENSION = {
  ...NATIVE_EXTENSION,
  ...CUSTOMIZED_EXTENSION,
}
export type EXTENSION = NATIVE_EXTENSION | CUSTOMIZED_EXTENSION
