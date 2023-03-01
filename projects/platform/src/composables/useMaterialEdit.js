import { useStore } from 'vuex'
import { reactive, computed } from 'vue'
import {
  INVENTORY_UNIT,
  MATERIAL_PRICING_CURRENCY,
  useConstants,
  CONTEXTUAL_MENU_MODE,
} from '@/utils/constants'

export default function useMaterialEdit() {
  const store = useStore()
  const { WEIGHT_UNIT } = useConstants()

  const inventoryUnitList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: {
      width: 'w-30',
      blockList: [
        {
          menuList: Object.keys(INVENTORY_UNIT).map((key) => ({
            selectValue: INVENTORY_UNIT[key],
            title: key,
          })),
        },
      ],
    },
  }))
  const currencyList = computed(() => ({
    selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
    menuTree: {
      width: 'w-30',
      blockList: [
        {
          menuList: Object.keys(MATERIAL_PRICING_CURRENCY).map((key) => ({
            selectValue: MATERIAL_PRICING_CURRENCY[key],
            title: key,
          })),
        },
      ],
    },
  }))

  const newContentList = reactive([])
  const newDescriptionList = reactive([])
  const newFinishList = reactive([])

  const specOptions = reactive({
    contentList: computed(() => ({
      width: 'w-100',
      scrollAreaMaxHeight: 'max-h-63',
      blockList: [
        {
          menuList: newContentList
            .concat(store.getters['assets/code'].contentList)
            .map((content) => ({
              selectValue: content.name,
              title: content.name,
            })),
        },
      ],
    })),
    weightUnitList: computed(() => ({
      selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
      menuTree: {
        width: 'w-35',
        blockList: [
          {
            menuList: Object.keys(WEIGHT_UNIT.value).map((key) => ({
              selectValue: WEIGHT_UNIT.value[key].value,
              title: WEIGHT_UNIT.value[key].text,
            })),
          },
        ],
      },
    })),
    descriptionList: computed(() => ({
      blockList: [
        {
          menuList: newDescriptionList
            .concat(store.getters['assets/code'].descriptionList)
            .map((description) => ({
              title: description.name,
              selectValue: description,
            })),
        },
      ],
    })),
    finishList: computed(() => ({
      blockList: [
        {
          menuList: newFinishList
            .concat(store.getters['assets/code'].finishList)
            .map((finish) => ({
              title: finish.name,
              selectValue: finish,
            })),
        },
      ],
    })),
    certificateList: computed(() => ({
      blockList: [
        {
          menuList: store.getters['assets/code'].certificateList.map(
            ({ name, certificateId }) => ({
              title: name,
              selectValue: {
                name,
                certificateId,
              },
            })
          ),
        },
      ],
    })),
  })

  const addDescriptionOption = (descriptionName) => {
    newDescriptionList.push({
      descriptionId: null,
      name: descriptionName,
    })
  }

  const addFinishOption = (finishName) => {
    newFinishList.push({
      finishId: null,
      name: finishName,
    })
  }

  const addContentOption = (contentName) => {
    newContentList.push({
      contentId: null,
      name: contentName,
    })
  }

  const selectContent = (contentName, contentItemIndex) => {
    const content = store.getters['assets/code'].contentList
      .concat(newContentList)
      .find((content) => content.name === contentName)
    store.commit('assets/UPDATE_content_item', {
      index: contentItemIndex,
      content,
    })
  }

  const addNewContent = () => {
    store.commit('assets/ADD_content_item')
  }

  const removeContent = (contentItemIndex) => {
    store.commit('assets/REMOVE_content_item', contentItemIndex)
  }

  const addNewInventory = () => {
    store.commit('assets/ADD_inventory_item')
  }

  const removeInventory = (index) => {
    store.commit('assets/REMOVE_inventory_item', index)
  }

  const updateInventoryListUnit = (unit) => {
    store.commit('assets/UPDATE_inventoryList_unit', unit)
  }

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
    updateInventoryListUnit,
  }
}
