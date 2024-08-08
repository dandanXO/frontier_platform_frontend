import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MenuTree } from '@frontier/ui-component'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import useEnumText from '@/composables/useEnumText'

const getSelectValue = (str: string) =>
  canConvertToInt(str) ? Number(str) : str

const canConvertToInt = (str: string) => Number.isInteger(Number(str))

/**
 * @param width tailwind css width, e.g. 'w-30'
 */
const getMenuTreeFromEnumText = (
  width: string,
  enumText: Record<number | string, string>,
  prefixTestId?: string
): MenuTree => {
  return {
    width,
    blockList: [
      {
        menuList: Object.entries(enumText).map(([value, name]) => ({
          selectValue: getSelectValue(value),
          title: name,
          testId: prefixTestId ? `${prefixTestId}-${value}` : undefined
        })),
      },
    ],
  }
}

const useMaterialStaticMenu = () => {
  const { t } = useI18n()
  const {
    materialTypeText,
    materialQuantityText,
    materialPerQuantityText,
    materialSideTypeText,
    lengthUnitText,
    weightUnitText,
    currencyText,
  } = useEnumText()

  const inventoryUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-30', materialQuantityText.value),
  }))

  const inventoryPerUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-30', materialPerQuantityText.value),
  }))

  const currencyList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-30', currencyText.value),
  }))

  const sideTypeMenuTree = computed<MenuTree>(() =>
    getMenuTreeFromEnumText('w-25', materialSideTypeText.value, "material-side")
  )

  const singleOrDoubleMenuTree = computed<MenuTree>(() => ({
    width: 'w-50',
    blockList: [
      {
        menuList: [
          { title: t('DD0061'), selectValue: false, testId: "1-side"},
          { title: t('DD0014'), selectValue: true, testId: "2-sides"},
        ],
      },
    ],
  }))

  const materialTypeOptionList = computed(() => {
    return Object.entries(materialTypeText.value).map(([value, name]) => {
      return { name, value: getSelectValue(value) }
    })
  })

  const weightUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-35', weightUnitText.value),
  }))

  const widthUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: getMenuTreeFromEnumText('w-35', lengthUnitText.value),
  }))

  return {
    materialTypeOptionList,
    inventoryUnitList,
    inventoryPerUnitList,
    currencyList,
    weightUnitList,
    widthUnitList,
    sideTypeMenuTree,
    singleOrDoubleMenuTree,
  }
}

export default useMaterialStaticMenu
