<template lang="pug">
filter-wrapper(
  iconName="fabric"
  :displayName="$t('MI0023')"
  :dirty="filterDirty.descriptionList"
  :confirmButton="false"
)
  f-contextual-menu(
    v-model:inputSelectValue="innerDescriptionList"
    :selectMode="CONTEXTUAL_MENU_MODE.MULTIPLE"
    :menuTree="menuTree"
    class="-mx-5 -my-4"
  )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { computed } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { MenuTree, MenuItem, MenuBlock } from '@frontier/ui-component'
import type { MaterialDescription } from '@frontier/platform-web-sdk'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const { t } = useI18n()
const filterStore = useFilterStore()
const { filterDirty, filterState, filterOption } = storeToRefs(filterStore)

const menuTree = computed<MenuTree>(() => {
  const menuList: MenuItem[] = []
  const { descriptionList } = filterOption.value
  if (descriptionList) {
    const getMenuItem = (
      firstLayerTitle: string,
      description: {
        default: MaterialDescription[]
        custom: MaterialDescription[]
      }
    ) => {
      const blockList: MenuBlock[] = []
      const allValueList: MaterialDescription['descriptionId'][] = []
      let hasSelectedAll = true

      const helper = ({ descriptionId, name }: MaterialDescription) => {
        allValueList.push(descriptionId)

        if (
          hasSelectedAll &&
          !innerDescriptionList.value.includes(descriptionId)
        ) {
          hasSelectedAll = false
        }

        return {
          title: name,
          selectValue: descriptionId,
        }
      }

      if (description.custom.length > 0) {
        blockList.push({
          blockTitle: t('RR0258'),
          menuList: description.custom.map(helper),
        })
      }

      if (description.default.length > 0) {
        blockList.push({
          blockTitle: t('Frontier System'),
          menuList: description.default.map(helper),
        })
      }

      return {
        width: 'w-57.5',
        title: firstLayerTitle,
        blockList,
        scrollAreaMaxHeight: 'max-h-104',
        searchEnable: true,
        button:
          allValueList.length > 1
            ? {
                position: 'bottom',
                icon: hasSelectedAll ? 'check_box' : 'check_box_outline_blank',
                text: t('RR0209'),
                clickHandler: () => {
                  hasSelectedAll
                    ? (innerDescriptionList.value = [])
                    : (innerDescriptionList.value = Array.from(
                        new Set([
                          ...innerDescriptionList.value,
                          ...allValueList,
                        ])
                      ))
                },
              }
            : null,
      } as MenuItem
    }

    const textMap: Required<{ [key in keyof typeof descriptionList]: string }> =
      {
        woven: t('RR0091'),
        knit: t('RR0092'),
        leather: t('MI0018'),
        nonWoven: t('MI0020'),
        trim: t('MI0021'),
        others: t('MI0022'),
      }

    Object.keys(textMap).forEach((key) => {
      const property = key as keyof typeof textMap
      const description = descriptionList[property]
      if (
        description &&
        (description.default.length > 0 || description.custom.length > 0)
      ) {
        menuList.push(getMenuItem(textMap[property], description!))
      }
    })
  }

  return {
    width: 'w-57.5',
    blockList: [
      {
        menuList,
      },
    ],
  }
})

const innerDescriptionList = computed({
  get: () => filterState.value.descriptionList,
  set: (v) => {
    filterStore.setFilterStateByProperty('descriptionList', v)
    emit('search')
  },
})
</script>
