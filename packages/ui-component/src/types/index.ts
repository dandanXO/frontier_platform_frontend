import type { Component } from 'vue'
import type { CONTEXTUAL_MENU_TYPE, DISPLAY } from '@frontier/constants'

export interface MenuButton {
  position: 'top' | 'bottom'
  icon: string
  text: string
  disabled?: boolean
  clickHandler: () => void
}

export interface MenuItem {
  title: string
  blockList?: MenuBlock[]
  titleLineClamp?: number
  description?: string
  descriptionLineClamp?: number
  display?: `${DISPLAY}`
  disabled?: boolean
  selectable?: boolean
  selectValue?: any
  icon?: string
  thumbnail?: string //  String (URL)
  thumbnailSize?: string // String (SIZE.MD & SIZE.SM)
  flag?: string // String (URL),
  tooltipTitle?: string
  tooltipMessage?: string
  tooltipContentComponent?: Component | null
  tooltipPlacement?: string
  searchEnable?: boolean
  button?: MenuButton | null
  width?: string // String (Tailwindcss),
  scrollAreaMaxHeight?: string // String (Tailwindcss),
  labelColor?: string
  hasNotify?: boolean
  testId?: string
  clickHandler?: (v: MenuItem) => void
  mouseEnterHandler?: () => void
  mouseLeaveHandler?: () => void
}

export interface MenuBlock {
  blockTitle?: String
  menuList: MenuItem[]
  disabledAddNew?: boolean
  usingCustomNotFound?: boolean
}

export interface MenuTree {
  rootTitle?: string
  searchEnable?: boolean
  button?: MenuButton | null
  width?: string // String (Tailwindcss),
  scrollAreaMaxHeight?: string // String (Tailwindcss),
  blockList: MenuBlock[]
  type?: (typeof CONTEXTUAL_MENU_TYPE)[keyof typeof CONTEXTUAL_MENU_TYPE]
}

export interface Action {
  text: string
  handler(): void
  classes?: string
}
