import { useStore } from 'vuex'
import { reactive, computed } from '@vue/runtime-core'
import { INVENTORY_UNIT, WEIGHT_UNIT, MATERIAL_PRICING_CURRENCY } from '@/utils/constants'

export default function useMaterialEdit (material) {
  const store = useStore()

  const inventoryUnitList = computed(() => Object.keys(INVENTORY_UNIT).map(key => ({ unit: INVENTORY_UNIT[key] })))
  const currencyList = computed(() => Object.keys(MATERIAL_PRICING_CURRENCY).map(key => ({ currency: MATERIAL_PRICING_CURRENCY[key] })))

  const newContentList = reactive([])
  const newDescriptionList = reactive([])
  const newFinishList = reactive([])

  const specOptions = reactive({
    contentList: computed(() => store.getters['material/code'].contentList.concat(newContentList)),
    weightUnitList: computed(() => {
      return Object.keys(WEIGHT_UNIT)
        .map(key => ({
          weightUnit: WEIGHT_UNIT[key].value,
          name: WEIGHT_UNIT[key].text
        }))
    }),
    descriptionList: computed(() => store.getters['material/code'].descriptionList.concat(newDescriptionList)),
    finishList: computed(() => store.getters['material/code'].finishList.concat(newFinishList))
  })

  const addDescriptionOption = (descriptionName) => {
    newDescriptionList.push({
      descriptionId: null,
      name: descriptionName
    })
  }

  const addFinishOption = (finishName) => {
    newFinishList.push({
      finishId: null,
      name: finishName
    })
  }

  const addContentOption = (contentName) => {
    newContentList.push({
      contentId: null,
      name: contentName
    })
  }

  const selectContent = (contentName, contentItemIndex) => {
    const content = specOptions.contentList.find(content => content.name === contentName)
    store.commit('material/UPDATE_content_item', { index: contentItemIndex, content })
  }

  const addNewContent = () => {
    store.commit('material/ADD_content_item')
  }

  const removeContent = (contentItemIndex) => {
    store.commit('material/REMOVE_content_item', contentItemIndex)
  }

  const addNewInventory = () => {
    store.commit('material/ADD_inventory_item')
  }

  const removeInventory = (index) => {
    store.commit('material/REMOVE_inventory_item', index)
  }

  const updateInventoryListUnit = (unit) => {
    store.commit('material/UPDATE_inventoryList_unit', unit)
  }

  const totalInventory = computed(() => {
    let inventoryUnit
    const total = material.inventoryList.reduce((prev, current) => {
      const { weightUnit, weight, width } = material
      const quantity = current.quantity
      inventoryUnit = current.unit

      if (!weight || !width) {
        return 0
      }

      switch (inventoryUnit) {
        case INVENTORY_UNIT.Y: {
          return prev + Number(quantity)
        }
        case INVENTORY_UNIT.M: {
          return prev + Number(quantity) / 0.9114
        }
        case INVENTORY_UNIT.KG: {
          let gsm
          if (weightUnit === WEIGHT_UNIT.GSM.value) {
            gsm = weight
          } else if (weightUnit === WEIGHT_UNIT.OZ.value) {
            gsm = weight / 0.9114
          }
          return prev + Number(quantity) / (gsm * 0.02323 * width) * 1000
        }
        default:
          return prev + Number(quantity)
      }
    }, 0)

    if ([INVENTORY_UNIT.M, INVENTORY_UNIT.KG].includes(inventoryUnit)) {
      return Math.round(total)
    }
    return total
  })

  return {
    inventoryUnitList,
    currencyList,
    specOptions,
    addContentOption,
    selectContent,
    addNewContent,
    removeContent,
    addDescriptionOption,
    addFinishOption,
    addNewInventory,
    removeInventory,
    totalInventory,
    updateInventoryListUnit
  }
}
