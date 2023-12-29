<template lang="pug">
div(class="fixed w-118.5 h-screen z-sidebar right-0")
  div(class="relative z-1 w-full h-full bg-grey-100 shadow-32 flex flex-col")
    //- Header
    div(
      class="w-full h-17.5 pl-4 pr-5 bg-grey-0 border-b border-grey-150 flex items-center"
    )
      template(v-if="!isEditingDigitalThreadName")
        div(class="relative")
          f-svg-icon(
            iconName="arrow_back"
            size="20"
            class="text-grey-600 hover:text-primary-400 cursor-pointer"
            :class="{ 'text-primary-400 transform rotate-180': isExpandDigitalThreadList, '!text-grey-200': digitalThread.hasMaterialDeleted || drawerOpenFromLocationType === FeatureType.NOTIFICATION }"
            tooltipMessage="Show all threads"
            @click="!(digitalThread.hasMaterialDeleted || drawerOpenFromLocationType === FeatureType.NOTIFICATION) && (isExpandDigitalThreadList = !isExpandDigitalThreadList)"
          )
          div(
            v-if="hasAnyUnreadDigitalThread && drawerOpenFromLocationType !== FeatureType.NOTIFICATION"
            class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-400"
          )
        div(class="w-px h-6 bg-grey-150 mx-4")
        div(
          class="flex-grow flex items-center"
          @mouseenter="isHoverHeader = true"
          @mouseleave="isHoverHeader = false"
        )
          div(:class="{ 'flex-grow': !isCreatingDigitalThread }")
            f-tooltip-standard(
              :key="isCreatingDigitalThread"
              class="flex items-center group"
              :disabledTooltip="isCreatingDigitalThread"
              :tooltipMessage="digitalThread.digitalThreadName"
            )
              template(#slot:tooltip-trigger)
                f-svg-icon(
                  iconName="sticker_thread"
                  size="20"
                  class="text-grey-900"
                  :class="{ 'group-hover:text-primary-400': !isCreatingDigitalThread }"
                )
                p(
                  class="pl-2.5 text-body1 font-bold line-clamp-1"
                  :class="[isCreatingDigitalThread ? 'text-grey-300' : 'text-grey-900 group-hover:text-primary-400', { 'cursor-pointer': !isCreatingDigitalThread }]"
                  @click="!isCreatingDigitalThread && threadBoardStore.gotoThreadCard(digitalThread.digitalThreadSideId)"
                ) {{ digitalThread.digitalThreadName }}
          div(class="flex-shrink pl-4 flex items-center gap-x-4")
            f-svg-icon(
              v-if="isHoverHeader"
              iconName="create"
              size="20"
              class="text-grey-600 hover:text-primary-400 cursor-pointer"
              :tooltipMessage="$t('TT0003')"
              @click="openDigitalThreadNameEditor"
            )
            f-svg-icon(
              v-if="!isCreatingDigitalThread"
              iconName="summary"
              size="20"
              class="text-grey-600 hover:text-primary-400 cursor-pointer"
              :tooltipMessage="$t('TT0067')"
              @click="openModalDigitalThreadSummary"
            )
        f-svg-icon(
          iconName="clear"
          size="20"
          class="text-grey-600 hover:text-primary-400 ml-4 cursor-pointer"
          tooltipMessage="Close"
          @click="closeStickerDrawer"
        )
      template(v-else)
        f-input-text(v-model:textValue="tempDigitalThreadName" class="flex-grow")
        f-button(
          type="primary"
          size="sm"
          class="ml-3 mr-2"
          :disabled="!tempDigitalThreadName || tempDigitalThreadName === digitalThread.digitalThreadName"
          @click="saveDigitalThreadName"
        ) {{ $t('UU0018') }}
        f-button(
          type="text"
          size="sm"
          @click="isEditingDigitalThreadName = false"
        ) {{ $t('UU0002') }}
    div(
      class="w-full h-28 px-8 pt-3 pb-2.5 bg-grey-0 shadow-2 relative"
      :key="material.materialId"
    )
      //- Material Info
      div(class="flex items-center gap-x-4")
        img(
          v-defaultImg
          class="flex-shrink-0 w-13 h-13 rounded overflow-hidden"
          :class="{ 'cursor-pointer': !digitalThread.hasMaterialDeleted || !digitalThread.hasMaterialNoAccess }"
          :src="material.coverImage?.thumbnailUrl"
          @click="goToStickerMaterialDetail(material, digitalThread, false)"
        )
        div(class="flex-grow h-11")
          p(
            class="group pb-2 flex items-center text-body2"
            :class="[digitalThread.hasMaterialDeleted || digitalThread.hasMaterialNoAccess ? 'text-grey-200' : 'text-grey-800']"
            @click="goToStickerMaterialDetail(material, digitalThread, false)"
          )
            span(
              class="font-bold line-clamp-1"
              :class="{ 'hover:text-primary-400 hover:underline hover:cursor-pointer': !digitalThread.hasMaterialDeleted && !digitalThread.hasMaterialNoAccess }"
            ) {{ material.itemNo }}
            f-svg-icon(
              v-if="!digitalThread.hasMaterialDeleted && !digitalThread.hasMaterialNoAccess"
              iconName="open_in_new"
              size="14"
              class="ml-1 invisible group-hover:visible text-grey-600 hover:text-primary-400 hover:cursor-pointer"
              @click.stop="goToStickerMaterialDetail(material, digitalThread, true)"
              tooltipMessage="RR0304"
            )
            span(class="leading-1.4 pl-0.5" v-if="digitalThread.hasMaterialDeleted") ({{ $t('TT0112') }})
            span(
              class="leading-1.4 pl-0.5"
              v-else-if="digitalThread.hasMaterialNoAccess"
            ) ({{ $t('TT0107') }})
          div(class="flex items-center gap-x-2")
            f-avatar(
              :imageUrl="material.metaData.unitLogo"
              type="org"
              size="xs"
            )
            span(class="text-caption text-grey-800") {{ material.metaData.unitName }}
      //- Filter
      div(class="pt-2.5 flex items-center gap-x-2")
        f-select-dropdown(
          v-model:selectValue="filter.addTo"
          :dropdownMenuTree="menuAddTo"
          class="w-30"
          size="sm"
        )
        div(class="w-px py-2 box-content bg-grey-150")
        //- isStarred
        button(
          class="px-2.5 h-6 rounded-[20px] flex justify-center items-center gap-x-0.5"
          :class="[filter.isStarred ? 'bg-primary-50' : 'bg-grey-100']"
          @click="!isCreatingDigitalThread && (filter.isStarred = !filter.isStarred)"
        )
          f-svg-icon(
            iconName="starred"
            size="14"
            :class="[isCreatingDigitalThread ? 'text-grey-200' : 'text-yellow-400']"
          )
          span(
            :class="{ 'text-grey-200': isCreatingDigitalThread, 'text-grey-800': !isCreatingDigitalThread && !filter.isStarred && !digitalThread.hasMaterialDeleted, 'text-primary-400': filter.isStarred }"
            class="text-body2"
          ) {{ $t('TT0019') }}
          span(
            v-if="showStartQty"
            class="pl-1 text-caption fond-bold"
            :class="[filter.isStarred ? 'text-primary-400' : 'text-grey-600']"
          ) {{ digitalThread.stickerStatistics.starredQty }}
        //- Advance Filter Panel
        f-popper(
          placement="bottom"
          :offset="[-17, 8]"
          :disabled="isCreatingDigitalThread"
        )
          template(#trigger="{ isExpand }")
            button(
              :class="{ 'bg-primary-50': isExpand || isAdvanceFilterDirty }"
              class="px-2 h-6 rounded-[20px] bg-grey-100 flex items-center"
            )
              f-svg-icon(
                iconName="filter"
                size="16"
                :class="[isExpand || isAdvanceFilterDirty ? 'text-primary-400' : 'text-grey-800']"
              )
          template(#content="{ collapsePopper }")
            div(class="bg-grey-0 shadow-16 rounded w-93.5 py-4")
              div(
                class="px-4 pb-5 border-b border-grey-150 flex items-center justify-between"
              )
                p(class="text-body2 font-bold text-grey-900") {{ $t('RR0085') }}
                f-svg-icon(
                  iconName="clear"
                  size="20"
                  class="text-grey-600 cursor-pointer"
                  @click="collapsePopper"
                ) 
              div(class="flex flex-col divide-y divide-grey-150")
                div(class="px-4 py-3.5")
                  div(class="flex items-center gap-x-2.5 pb-3")
                    p(class="text-grey-900 text-caption font-bold") {{ $t('TT0047') }}
                    f-button-label(
                      @click="$store.commit('sticker/RESET_filter_addedBy')"
                    ) {{ $t('UU0040') }}
                  div(class="flex flex-col gap-y-3")
                    f-input-checkbox(
                      binary
                      v-model:inputValue="filter.addedBy.addedByMe"
                      :label="$t('TT0048', { username })"
                      iconSize="20"
                    )
                    f-input-checkbox(
                      binary
                      v-model:inputValue="filter.addedBy.addedByInternalUnit"
                      :label="$t('TT0049', { orgName })"
                      iconSize="20"
                    )
                    f-input-checkbox(
                      binary
                      v-model:inputValue="filter.addedBy.addedByExternalUnit"
                      :label="$t('TT0050')"
                      iconSize="20"
                    )
                div(class="px-4 py-3.5")
                  div(class="flex items-center gap-x-2.5 pb-3")
                    p(class="text-grey-900 text-caption font-bold") {{ $t('TT0052') }}
                    f-button-label(
                      @click="$store.commit('sticker/RESET_filter_createDate')"
                    ) {{ $t('UU0040') }}
                  div(class="flex items-center gap-x-2")
                    f-input-text(
                      v-model:textValue="filter.createStartDate"
                      inputType="date"
                      size="md"
                      class="flex-1"
                    )
                    span(class="text-body1 text-grey-900") ~
                    f-input-text(
                      v-model:textValue="filter.createEndDate"
                      inputType="date"
                      size="md"
                      class="flex-1"
                    ) 
                div(class="px-4 py-3.5")
                  div(class="flex items-center gap-x-2.5 pb-3")
                    f-svg-icon(iconName="tag" size="16" class="text-grey-900 -mr-0.5")
                    p(class="text-grey-900 text-caption font-bold") {{ $t('TT0053') }}
                    f-button-label(
                      @click="$store.commit('sticker/RESET_filter_tagList')"
                    ) {{ $t('UU0040') }}
                  div
                    f-input-text(
                      v-model:textValue="inputSearchTagList"
                      size="md"
                      prependIcon="search"
                      :placeholder="$t('RR0053')"
                    )
                    div(class="pt-3")
                      p(
                        v-if="!!inputSearchTagList"
                        class="text-caption text-grey-400 pb-2"
                      ) {{ displayTagList.length === 0 ? $t('TT0105') : $t('TT0104') }}
                      div(class="flex flex-wrap gap-x-2 gap-y-2")
                        f-tag(
                          v-for="tag in displayTagList"
                          :key="tag.text"
                          size="sm"
                          class="cursor-pointer"
                          :isActive="tag.isSelect"
                          :appendIcon="tag.isSelect ? 'done' : ''"
                          @click="toggleTagList(tag.text)"
                        ) {{ tag.text }}
                      p(
                        v-if="sourceTagList.length >= 10 && !isShowMore"
                        class="text-cyan-400 text-caption pt-2"
                        @click="isShowMore = true"
                      ) {{ $t('TT0054') }}
        button(
          v-if="isFilterDirty"
          class="text-caption text-grey-400"
          @click="$store.commit('sticker/RESET_filter')"
        ) {{ $t('UU0040') }}
      div(
        class="absolute z-1 bottom-3 right-6 w-6 h-6 hover:bg-grey-100 hover:rounded flex justify-center items-center cursor-pointer"
        @click="$store.dispatch('helper/pushModal', { component: 'modal-digital-thread-feature-reminder' })"
      )
        f-svg-icon(iconName="question" size="16" class="text-grey-600")
    //- Content
    f-scrollbar-container(class="flex-grow")
      div(v-if="isFetchingDigitalThread" class="pt-28.5 flex items-center justify-center")
        f-svg-icon(iconName="loading" size="84" class="text-primary-400")
      div(v-show="!isFetchingDigitalThread" class="py-4")
        //- Button: Add a sticker
        div(v-if="!isAddingSticker && !isFilterDirty" class="pl-8 pr-10.5")
          f-tooltip-standard(
            isNotFitWidth
            :disabledTooltip="!digitalThread.hasMaterialDeleted"
            :tooltipMessage="$t('TT0102')"
          )
            template(#slot:tooltip-trigger)
              button(
                class="relative w-full h-16 rounded-md overflow-hidden shadow-2 hover:shadow-4"
                :class="[digitalThread.hasMaterialDeleted ? 'bg-grey-50' : 'bg-grey-0']"
                @click="!digitalThread.hasMaterialDeleted && setIsAddingSticker(true)"
              )
                div(class="absolute top-0 left-0 w-1 h-full bg-forestgreen-300")
                div(class="pl-7.5 h-full flex items-center")
                  f-svg-icon(iconName="add" size="20" class="text-forestgreen-300")
                  span(
                    class="text-body2 font-bold pl-3"
                    :class="[digitalThread.hasMaterialDeleted ? 'text-grey-200' : 'text-grey-800']"
                  ) {{ $t('TT0092') }}
        //- Default intro
        div(v-if="isCreatingDigitalThread && !isAddingSticker" class="pl-8 pr-10.5")
          div(class="pt-10")
            img(src="@/assets/images/sticker_empty.png" class="w-72.5 ml-15")
            i18n-t(
              keypath="TT0004"
              tag="p"
              class="text-h6 font-bold text-grey-300 text-center pb-6"
              scope="global"
            )
              template(#TT0092)
                span(
                  class="text-grey-800 cursor-pointer hover:text-primary-500"
                  @click="setIsAddingSticker(true)"
                ) {{ $t('TT0092') }}
            p(class="text-body2 leading-1.6 text-grey-400 text-center") {{ $t('TT0005') }}
        //- State - Normal
        template(v-else)
          div(v-if="isAddingSticker" class="pl-8 pr-7")
            sticker-create(
              :isCreatingDigitalThread="isCreatingDigitalThread"
              :digitalThreadName="digitalThread.digitalThreadName"
              @close="setIsAddingSticker(false)"
            )
          div(
            v-if="stickerList.length === 0 && isFilterDirty"
            class="pt-29 flex flex-col items-center"
          )
            img(src="@/assets/images/sticker_no_result.png" class="w-47")
            p(class="text-body2 text-grey-400 pt-6 pb-8.5") {{ $t('RR0105') }}
            p(
              class="text-body2 text-grey-900 cursor-pointer"
              @click="$store.commit('sticker/RESET_filter')"
            ) {{ $t('TT0114') }}
          div(v-else class="pt-3 pl-8 pr-10.5 flex flex-col gap-y-3")
            sticker-card(
              v-for="sticker in stickerList"
              :key="sticker.stickerId"
              :sticker="sticker"
            )
  template(v-if="isExpandDigitalThreadList")
    div(class="absolute z-0 top-0 right-0 w-screen h-screen bg-grey-900/30")
    div(
      class="absolute z-0 top-0 right-full w-118.5 h-screen bg-grey-0 border border-grey-150 shadow-8 flex flex-col"
    )
      div(
        class="group w-full h-17.5 px-4.5 border-b border-grey-150 flex items-center gap-x-2"
      )
        f-svg-icon(iconName="sticker_thread" size="20" class="text-grey-900")
        span(class="text-body1 font-bold text-grey-900 whitespace-nowrap") {{ $t('TT0076') }}
        span(
          class="text-body1 font-bold text-grey-800 line-clamp-1"
          :class="{ 'hover:text-primary-400 hover:underline hover:cursor-pointer': !digitalThread.hasMaterialDeleted && !digitalThread.hasMaterialNoAccess }"
          @click.stop="goToStickerMaterialDetail(material, digitalThread, false)"
        ) {{ material.itemNo }}
        f-svg-icon(
          v-if="!digitalThread.hasMaterialDeleted && !digitalThread.hasMaterialNoAccess"
          iconName="open_in_new"
          size="14"
          class="invisible group-hover:visible text-grey-600 hover:text-primary-400 hover:cursor-pointer"
          @click.stop="goToStickerMaterialDetail(material, digitalThread, true)"
          tooltipMessage="RR0304"
        )
      f-scrollbar-container(class="flex-grow")
        div(
          class="mt-3 mx-5 mb-2.5 h-13 bg-grey-0 border border-grey-150 rounded-md flex items-center justify-center gap-x-2 cursor-pointer"
          @click="startToCreateDigitalThread"
        )
          f-svg-icon(iconName="add" size="16" class="text-grey-900")
          p(class="text-body2 font-bold text-grey-900") {{ $t('TT0106') }}
        digital-thread-card(
          v-for="(digitalThread, index) in digitalThreadList"
          :key="`${index}-${digitalThread.digitalThreadSideId}`"
          :digitalThread="digitalThread"
          :class="{ 'bg-grey-100': index === indexOfDrawerDigitalThread }"
          @click="openDigitalThread(digitalThread, index)"
        )
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import StickerCreate from '@/components/sticker/StickerCreate.vue'
import { STICKER_ADD_TO } from '@/utils/constants'
import StickerCard from '@/components/sticker/StickerCard.vue'
import DigitalThreadCard from '@/components/sticker/DigitalThreadCard.vue'
import useThreadBoardStore from '@/stores/threadBoard'
import useDigitalThreadWorkflowStageStore from '@/stores/digitalThreadWorkflowStage'
import useLogSender from '@/composables/useLogSender'
import {
  type Material,
  type DigitalThreadBase,
  FeatureType,
} from '@frontier/platform-web-sdk'
import useGoToStickerMaterialDetail from '@/composables/useGoToStickerMaterialDetail'

const store = useStore()
const threadBoardStore = useThreadBoardStore()
const logSender = useLogSender()
const { t } = useI18n()
const workflowStageStore = useDigitalThreadWorkflowStageStore()
const goToStickerMaterialDetail = useGoToStickerMaterialDetail()

const material = computed<Material>(() => store.getters['sticker/material'])
const digitalThread = computed(() => store.getters['sticker/digitalThread'])
const drawerOpenFromLocationType = computed(
  () => store.getters['sticker/drawerOpenFromLocationType']
)
const stickerList = computed(() => digitalThread.value.stickerList)
const isHoverHeader = ref(false)
const isCreatingDigitalThread = computed(
  () =>
    digitalThread.value.digitalThreadSideId === null &&
    stickerList.value.length === 0
) // 全新的 digital thread 尚未建立任何一個 sticker

const isFetchingDigitalThread = computed<boolean>(
  () => store.getters['sticker/isFetchingDigitalThread']
)
const isAddingSticker = ref(false)
const setIsAddingSticker = (bool: boolean) => (isAddingSticker.value = bool)

const isEditingDigitalThreadName = ref(false)
const tempDigitalThreadName = ref('')
const openDigitalThreadNameEditor = () => {
  isEditingDigitalThreadName.value = true
  tempDigitalThreadName.value = digitalThread.value.digitalThreadName
}
const saveDigitalThreadName = () => {
  isEditingDigitalThreadName.value = false
  store.dispatch('sticker/updateDigitalThreadName', {
    isCreatingDigitalThread: isCreatingDigitalThread.value,
    digitalThreadName: tempDigitalThreadName.value,
  })
}

const menuAddTo = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: 'All',
          selectValue: STICKER_ADD_TO.ALL,
          icon: 'all',
        },
        {
          title: t('TT0009'),
          selectValue: STICKER_ADD_TO.EXTERNAL,
          icon: 'external',
        },
        {
          title: t('TT0010'),
          selectValue: STICKER_ADD_TO.INTERNAL,
          icon: 'internal',
        },
      ],
    },
  ],
}))

const showStartQty = computed(() => {
  if (isCreatingDigitalThread.value) {
    return false
  }
  if (filter.value.isStarred) {
    return true
  }
  if (digitalThread.value.stickerStatistics.starredQty > 0) {
    return true
  }
  return false
})

const openModalDigitalThreadSummary = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-digital-thread-summary',
  })
}

const isExpandDigitalThreadList = ref(false)
const indexOfDrawerDigitalThread = computed(
  () => store.getters['sticker/indexOfDrawerDigitalThread']
)
const digitalThreadList = computed<DigitalThreadBase[]>(() =>
  store.getters['sticker/tempDigitalThreadList'].concat(
    store.getters['sticker/digitalThreadList']
  )
)

const startToCreateDigitalThread = () => {
  setIsAddingSticker(false)
  store.dispatch('sticker/startToCreateDigitalThread')
}

const openDigitalThread = async (
  digitalThread: DigitalThreadBase,
  index: number
) => {
  if (indexOfDrawerDigitalThread.value === index) {
    return
  }
  isChangingDigitalThread.value = true
  setIsAddingSticker(false)
  store.commit('sticker/SET_indexOfDrawerDigitalThread', index)
  store.commit('sticker/RESET_filter')
  store.commit('sticker/SET_isCurrentThreadFilterTagListToggled', false)
  const digitalThreadSideId = digitalThread.digitalThreadSideId
  if (digitalThreadSideId === null) {
    // 避免 isChangingDigitalThread 太快被切換回 false 導致 watch handler 被處執行
    setTimeout(() => {
      store.commit('sticker/SET_digitalThread', digitalThread)
      isChangingDigitalThread.value = false
    }, 0)
  } else {
    await store.dispatch('sticker/fetchStickerDrawerData', {
      digitalThreadSideId,
      showLoading: true,
    })
    isChangingDigitalThread.value = false
  }
}
/**
 * 在切換 digital thread 時因為會執行 reset filter 的行為，所以會觸發到 watch，
 * 但因為 digital thread id 還是舊的，所以會拿到舊的資料，
 * 因此設定一個 flag 來阻止因 reset 時而觸發的 watch handler
 */
const isChangingDigitalThread = ref(false)
const filter = computed(() => store.getters['sticker/filter'])
const isFilterDirty = computed<boolean>(
  () => store.getters['sticker/isFilterDirty']
)
const isAdvanceFilterDirty = computed<boolean>(
  () => store.getters['sticker/isAdvanceFilterDirty']
)
const isCurrentThreadFilterTagListToggled = computed<boolean>(
  () => store.getters['sticker/isCurrentThreadFilterTagListToggled']
)

watch(
  () => filter.value,
  () => {
    store.commit('sticker/SET_filter', filter.value)
    !isCreatingDigitalThread.value &&
      !isChangingDigitalThread.value &&
      store.dispatch('sticker/fetchStickerDrawerData', {
        digitalThreadSideId: digitalThread.value.digitalThreadSideId,
        showLoading: true,
      })
  },
  {
    deep: true,
    flush: 'post', // avoid it be invoked after component unmount
  }
)
const orgName = computed<string>(
  () => store.getters['organization/organization'].orgName
)
const username = computed<string>(
  () => store.getters['organization/orgUser/orgUser'].displayName
)
const inputSearchTagList = ref('')
const sourceTagList = computed<string[]>(
  () => store.getters['sticker/sourceTagList']
)
const isShowMore = ref(false)
const displayTagList = computed(() => {
  const tagList = sourceTagList.value
    .filter((tag) => tag.includes(inputSearchTagList.value || ''))
    .map((tag) => ({
      isSelect: filter.value.tagList.includes(tag) as boolean,
      text: tag,
    }))
    .sort((a, b) => {
      if (a.isSelect === b.isSelect) {
        return 0
      }
      if (a.isSelect) {
        return -1
      }
      return 1
    })

  if (isShowMore.value) {
    return tagList
  }

  let amountOfSelect = 0
  for (const tag of tagList) {
    if (!tag.isSelect) {
      break
    }
    amountOfSelect++
  }

  return tagList.slice(0, Math.max(10, amountOfSelect))
})

const toggleTagList = (selectTag: string) => {
  if (!isCurrentThreadFilterTagListToggled.value) {
    logSender.createStickerTagFilterLog()
  }
  store.dispatch('sticker/toggleFilterTagList', selectTag)
}

const closeStickerDrawer = () => {
  threadBoardStore.deactivateThreadCard()
  store.dispatch('sticker/closeStickerDrawer')
}

const hasAnyUnreadDigitalThread = computed<boolean>(() =>
  store.getters['sticker/digitalThreadList'].some(
    (digitalThread: DigitalThreadBase) => digitalThread.unreadStickerQty > 0
  )
)

onMounted(workflowStageStore.getWorkflowStageOptionList)
</script>
