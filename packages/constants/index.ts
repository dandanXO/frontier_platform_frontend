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
