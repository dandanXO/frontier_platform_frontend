import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MenuTree } from '@frontier/ui-component'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import {
  MaterialTypeText,
  MaterialQuantityText,
  MaterialSideTypeText,
  LengthUnitText,
  WeightUnitText,
  CurrencyText,
} from '@/utils/enumText'

const getSelectValue = (str: string) =>
  canConvertToInt(str) ? Number(str) : str

const canConvertToInt = (str: string) => Number.isInteger(Number(str))

/**
 * @param width tailwind css width, e.g. 'w-30'
 */
const getMenuTreeFromEnumText = (
  width: string,
  enumText: Record<number | string, string>
): MenuTree => {
  return {
    width,
    blockList: [
      {
        menuList: Object.entries(enumText).map(([value, name]) => ({
          selectValue: getSelectValue(value),
          title: name,
        })),
      },
    ],
  }
}

const useMaterialStaticMenu = () => {
  const { t } = useI18n()

  const inventoryUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-30', MaterialQuantityText),
  }))

  const currencyList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-30', CurrencyText),
  }))

  const sideTypeMenuTree = computed<MenuTree>(() =>
    getMenuTreeFromEnumText('w-25', MaterialSideTypeText)
  )

  const singleOrDoubleMenuTree = computed<MenuTree>(() => ({
    width: 'w-50',
    blockList: [
      {
        menuList: [
          { title: t('DD0061'), selectValue: false },
          { title: t('DD0014'), selectValue: true },
        ],
      },
    ],
  }))

  const materialTypeOptionList = computed(() => {
    return Object.entries(MaterialTypeText).map(([value, name]) => {
      return { name, value: getSelectValue(value) }
    })
  })

  const weightUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-35', WeightUnitText),
  }))

  const widthUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-35', LengthUnitText),
  }))

  return {
    materialTypeOptionList,
    inventoryUnitList,
    currencyList,
    weightUnitList,
    widthUnitList,
    sideTypeMenuTree,
    singleOrDoubleMenuTree,
  }
}

export default useMaterialStaticMenu
