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
    filter-wrapper(
      class="w-40"
      iconName="filter"
      :displayName="$t('RR0085')"
      :filterCount="filterCount"
      :dirty="isFilterDirty"
    )
      template(#default="{ collapsePopper }")
        div(class="w-93.5 rounded shadow-16")
          div(class="px-4 py-5 flex flex-row items-center justify-between")
            span(class="text-body2 text-grey-900 font-bold") {{ $t('RR0085') }}
            f-svg-icon(
              class="text-grey-600 cursor-pointer"
              iconName="close"
              size="24"
              @click="collapsePopper"
            )
          div(class="w-full h-px bg-grey-150")
          div(class="px-4 py-3.5 flex flex-col gap-3")
            div(class="flex flex-row items-center gap-2.5")
              span(class="text-caption text-grey-900 font-bold") {{ $t('TT0062') }}
              f-button-label(size="sm" @click="clearCreatedByFilter") {{ $t('UU0040') }}
            div(v-for="item in createdByMenu" :key="item.id")
              f-input-checkbox(
                binary
                :label="item.name"
                :inputValue="item.checked"
                @update:inputValue="item.handleInput"
                iconSize="20"
              )
          div(class="w-full h-px bg-grey-150")
          div(class="px-4 py-3.5 flex flex-col gap-3")
            div(class="flex flex-row items-center gap-2.5")
              span(class="text-caption text-grey-900 font-bold") {{ $t('TT0072') }}
              f-button-label(size="sm" @click="clearParticipantsFilter") {{ $t('UU0040') }}
            div(v-for="item in participantFilterItemList" :key="item.id")
              f-input-checkbox(
                binary
                :label="item.name"
                :inputValue="item.checked"
                @update:inputValue="item.handleInput"
                iconSize="20"
              )
            f-select-input(
              v-if="showParticipantSelectInput"
              size="md"
              prependIcon="search"
              :canAddNew="false"
              :placeholder="$t('TT0166')"
              :dropdownMenuTree="participantShowMoreMenuTree"
            )
            p(
              v-else
              class="text-caption text-cyan-400 cursor-pointer"
              @click="showParticipantSelectInput = true"
            ) {{ $t('TT0054') }}
          div(class="w-full h-px bg-grey-150")
          div(class="px-4 py-3.5 flex flex-col gap-3")
            div(class="flex flex-row items-center gap-2.5")
              span(class="text-caption text-grey-900 font-bold") {{ $t('TT0165') }}
              f-button-label(size="sm" @click="clearStickerTypeFilter") {{ $t('UU0040') }}
            div(v-for="item in stickerTypeMenu" :key="item.id")
              f-input-checkbox(
                binary
                :label="item.name"
                :inputValue="item.checked"
                @update:inputValue="item.handleInput"
                iconSize="20"
              )
          div(class="w-full h-px bg-grey-150")
          div(class="px-4 py-3.5 flex flex-col gap-3")
            div(class="flex flex-row items-center gap-2.5")
              span(class="text-caption text-grey-900 font-bold") {{ $t('RR0065') }}
              f-button-label(size="sm" @click="clearDateCreatedFilter") {{ $t('UU0040') }}
            div(class="flex flex-row gap-2")
              f-input-text(
                inputType="date"
                size="md"
                class="flex-1"
                :textValue="dateCreatedInput.start.value"
                @update:textValue="dateCreatedInput.start.handleInput"
              )
              span(class="text-body1 text-grey-900") ~
              f-input-text(
                inputType="date"
                size="md"
                class="flex-1"
                :textValue="dateCreatedInput.end.value"
                @update:textValue="dateCreatedInput.end.handleInput"
              )
    div(class="w-px h-6 bg-grey-150")
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
import FilterWrapper from '@/components/threadBoard/FilterWrapper.vue'

const { t } = useI18n()
const threadBoardStore = useThreadBoardStore()
const {
  threadBoardQuery,
  threadQty,
  canClearFilterAndSearch,
  searchText,
  filterCount,
  isFilterDirty,
  participantFilterItemList,
  createdByMenu,
  participantMenu,
  stickerTypeMenu,
  dateCreatedInput,
} = storeToRefs(threadBoardStore)
const {
  updateQuery,
  clearAllQuery,
  updateSearchText,
  clearCreatedByFilter,
  clearParticipantsFilter,
  clearStickerTypeFilter,
  clearDateCreatedFilter,
} = threadBoardStore

const isSearchInputFocus = ref(false)
const showParticipantSelectInput = ref(false)

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

const participantShowMoreMenuTree = computed(() => ({
  blockList: [
    {
      menuList: participantMenu.value.map((item) => ({
        title: item.name || '123',
        selectValue: item.id,
        thumbnail: item.avatar,
        clickHandler: item.handleInput,
      })),
    },
  ],
}))

const sortBy = computed({
  get: () => threadBoardQuery.value.sortBy,
  set: (sortBy) => updateQuery({ sortBy }),
})

const isLongSearchInput = computed(
  () => isSearchInputFocus.value || searchText.value.length > 0
)
</script>

<style scoped></style>
