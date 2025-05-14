<template lang="pug">
filter-wrapper(
  iconName="ingredient"
  :displayName="$t('RR0021')"
  :dirty="filterDirty.contentList"
  :confirmDisabled="!!errorMsg || contentList.length === 0"
  @confirm="update"
)
  div(class="w-110 flex flex-col gap-y-3")
    div(class="flex justify-between items-center")
      div(class="flex items-center gap-x-2")
        p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0021') }}
        f-button-label(
          v-if="contentList.length > 0"
          size="sm"
          @click.stop="reset"
        ) {{ $t('UU0040') }}
      f-svg-icon(size="20" iconName="add_box" class="text-grey-600" @click="addItem")
    div(v-if="contentList.length > 0" class="grid gap-y-5 relative py-2")
      div(
        v-for="(content, contentItemIndex) in contentList"
        :key="contentItemIndex"
        class="flex items-center gap-x-3"
      )
        f-select-dropdown(
          v-model:selectValue="content.name"
          :dropdownMenuTree="menuTree"
          :placeholder="$t('RR0292')"
          class="w-58 mr-3"
          :style="{ zIndex: contentList.length - contentItemIndex }"
        )
        f-input-text(
          v-model:textValue="content.percentage"
          inputType="number"
          class="w-38"
          addOnRight="%"
          :min="0"
          :max="100"
        )
        f-svg-icon(
          size="20"
          iconName="delete"
          class="text-grey-600"
          @click.stop="removeItem(contentItemIndex)"
        )
      p(
        v-if="errorMsg"
        class="text-caption text-red-400 absolute bottom-0 transform translate-y-full"
      ) {{ errorMsg }}
    f-infobar
      p {{ $t('JJ0003') }}
      p {{ $t('JJ0004') }}
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { inputValidator } from '@frontier/lib'
import { useFilterStore, type FilterState } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { clone } from 'ramda'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const { t } = useI18n()
const filterStore = useFilterStore()
const { filterOption, filterState, filterDirty } = storeToRefs(filterStore)

const menuTree = computed(() => {
  const actualContentList =
    (filterOption.value.contentList as unknown as
      | { displayName: string; value: string }[]
      | undefined) ?? []

  const mappedMenuList = actualContentList.map(
    (item: { displayName: string; value: string }) => ({
      title: item.displayName,
      selectValue: item.value,
    })
  )

  return {
    width: 'w-64',
    blockList: [
      {
        menuList: mappedMenuList,
      },
    ],
  }
})

const contentList = ref<
  {
    name: string | null
    percentage: number | null
  }[]
>(clone(filterState.value.contentList))

// Watch for external changes to the store's contentList (e.g., global reset)
watch(
  () => filterState.value.contentList,
  (newStoreList, oldStoreList) => {
    contentList.value = clone(newStoreList)
  },
  { deep: true }
)

const errorMsg = computed(() => {
  let total = 0
  for (let i = 0; i < contentList.value.length; i++) {
    const { name, percentage } = contentList.value[i]

    if (name === null || percentage === null) {
      return t('WW0002')
    }

    if (!inputValidator.maxIntegerDecimal(3, 2, percentage)) {
      return t('WW0151', { number: 3 })
    }

    total += percentage
  }
  if (total > 100) {
    return t('WW0060')
  }

  return false
})

const addItem = () =>
  contentList.value.push({
    name: null,
    percentage: null,
  })
const removeItem = (index: number) => contentList.value.splice(index, 1)
const reset = () => {
  contentList.value.length = 0
}

const update = () => {
  filterStore.setFilterStateByProperty(
    'contentList',
    contentList.value as FilterState['contentList']
  )
  emit('search')
}
</script>
