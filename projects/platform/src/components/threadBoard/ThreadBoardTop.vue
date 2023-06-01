<template lang="pug">
div(
  class="h-13 flex-shrink-0 flex flex-row justify-between items-center px-7.5 border-b border-grey-150"
)
  div(class="flex flex-row items-center gap-2")
    f-svg-icon(iconName="sticker_thread" size="20" class="text-primary-400")
    span(class="font-bold text-body1 text-grey-900") {{ $t('TT0133') }}
    span(class="text-body2 text-grey-600") {{ $t('RR0068', { number: threadQty }) }}
  div(class="flex flex-row items-center gap-2")
    f-button(
      v-if="canClearFilterAndSearch"
      type="special"
      class="text-grey-400 text-body2"
      @click="clearAllQuery"
    ) {{ $t('UU0041') }}
    div(v-if="canClearFilterAndSearch" class="h-6 w-px bg-grey-150")
    f-input-text(
      :class="isLongSearchInput ? 'w-100' : 'w-40'"
      size="md"
      :placeholder="isLongSearchInput ? 'Search by thread title, item name, organization name' : $t('RR0053')"
      prependIcon="search"
      :textValue="searchText"
      @update:textValue="updateSearchText"
      @focus="isSearchInputFocus = true"
      @blur="isSearchInputFocus = false"
    )
    div(class="h-6 w-px bg-grey-150")
    f-popper(placement="bottom-end")
      template(#trigger="{ isSortByMenuExpand }")
        f-svg-icon(
          iconName="sortby"
          size="24"
          class="transform cursor-pointer text-grey-600 hover:text-primary-400"
          :class="{ 'text-primary-400': isSortByMenuExpand }"
        )
      template(#content)
        f-contextual-menu(
          v-model:inputSelectValue="sortBy"
          :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL"
          :menuTree="sortByMenuTree"
        )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { CONTEXTUAL_MENU_MODE } from '@frontier/constants'
import { ThreadBoardQuerySortByEnum } from '@frontier/platform-web-sdk'
import useThreadBoardStore from '@/stores/threadBoard'

const { t } = useI18n()
const threadBoardStore = useThreadBoardStore()
const { threadBoardQuery, searchText, threadQty, canClearFilterAndSearch } =
  storeToRefs(threadBoardStore)
const { updateQuery, updateSearchText, clearAllQuery } = threadBoardStore

const isSearchInputFocus = ref(false)

const sortByMenuTree = {
  blockList: [
    {
      blockTitle: t('TT0168'),
      menuList: [
        {
          title: t('TT0167'),
          selectValue: ThreadBoardQuerySortByEnum.CUSTOM,
        },
        {
          title: t('TT0169'),
          selectValue: ThreadBoardQuerySortByEnum.NEWEST_TO_OLDEST,
        },
        {
          title: t('TT0170'),
          selectValue: ThreadBoardQuerySortByEnum.OLDEST_TO_NEWEST,
        },
      ],
    },
  ],
}

const sortBy = computed({
  get: () => threadBoardQuery.value.sortBy,
  set: (sortBy) => updateQuery({ sortBy }),
})

const isLongSearchInput = computed(
  () => isSearchInputFocus.value || searchText.value.length > 0
)
</script>

<style scoped></style>
