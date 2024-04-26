import i18n from '@frontier/i18n'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import { MATERIAL_SIDE_TYPE } from '../constants'
import { useBreakpoints } from '@frontier/lib'

export type SideOption = {
  label: string | null
  selectValue: MATERIAL_SIDE_TYPE
  icon: string
  selectedIcon: string
}

const t = i18n.global.t
const { isMobile } = useBreakpoints()

export const getMaterialSideOptionList: (
  isDoubleSide: boolean,
  isComposite: boolean,
  sideType: MaterialSideType | null
) => SideOption[] = (isDoubleSide, isComposite, sideType) => {
  const list: {
    label: string | null
    selectValue: MATERIAL_SIDE_TYPE
    icon: string
    selectedIcon: string
  }[] = []

  const addFace = () =>
    list.push({
      label: isMobile.value ? null : t('MI0007'),
      selectValue: MATERIAL_SIDE_TYPE.FACE,
      icon: 'front',
      selectedIcon: 'face_full',
    })
  const addMiddle = () =>
    list.push({
      label: isMobile.value ? null : t('MI0008'),
      selectValue: MATERIAL_SIDE_TYPE.MIDDLE,
      icon: 'middle',
      selectedIcon: 'middle_full',
    })
  const addBack = () =>
    list.push({
      label: isMobile.value ? null : t('MI0009'),
      selectValue: MATERIAL_SIDE_TYPE.BACK,
      icon: 'back',
      selectedIcon: 'back_full',
    })

  if (isDoubleSide) {
    addFace()
    if (isComposite) {
      addMiddle()
    }
    addBack()
  } else {
    if (sideType === MaterialSideType.FACE_SIDE) {
      addFace()
    } else {
      addBack()
    }
    if (isComposite) {
      addMiddle()
    }
  }

  return list
}
