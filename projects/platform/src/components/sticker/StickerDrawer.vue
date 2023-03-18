<template lang="pug">
div(class="fixed w-118.5 h-screen z-sidebar right-0")
  div(class="relative z-1 w-full h-full bg-grey-100 drop-shadow-4 flex flex-col")
    //- Header
    div(
      class="w-full h-17.5 pl-4 pr-5 bg-grey-0 border-b border-grey-150 flex items-center"
    )
      template(v-if="!isEditingDigitalThreadName")
        f-svg-icon(
          iconName="arrow_back"
          size="20"
          class="text-grey-600 hover:text-primary-400 cursor-pointer"
          :class="{ 'text-primary-400 transform rotate-180': isExpandDigitalThreadList, '!text-grey-200': digitalThread.hasMaterialDeleted || drawerOpenFromLocationType === LOCATION_TYPE.NOTIFICATION }"
          tooltip="Show all threads"
          @click="!(digitalThread.hasMaterialDeleted || drawerOpenFromLocationType === LOCATION_TYPE.NOTIFICATION) && (isExpandDigitalThreadList = !isExpandDigitalThreadList)"
        )
        div(class="w-px h-6 bg-grey-150 mx-4")
        div(
          class="flex-grow flex items-center"
          @mouseenter="isHoverHeader = true"
          @mouseleave="isHoverHeader = false"
        )
          div(:class="{ 'flex-grow': !isCreatingDigitalThread }")
            f-tooltip(:key="isCreatingDigitalThread" class="flex items-center group")
              template(#trigger)
                f-svg-icon(
                  iconName="sticker_thread"
                  size="20"
                  class="text-grey-900"
                  :class="{ 'group-hover:text-primary-400': !isCreatingDigitalThread }"
                )
                p(
                  class="pl-2.5 text-body1 font-bold line-clamp-1"
                  :class="[isCreatingDigitalThread ? 'text-grey-300' : 'text-grey-900 group-hover:text-primary-400']"
                ) {{ digitalThread.digitalThreadName }}
              template(v-if="!isCreatingDigitalThread" #content)
                p {{ digitalThread.digitalThreadName }}
          div(class="flex-shrink pl-4 flex items-center gap-x-4")
            f-svg-icon(
              v-if="isHoverHeader || !isCreatingDigitalThread"
              iconName="create"
              size="20"
              class="text-grey-600 hover:text-primary-400 cursor-pointer"
              :tooltip="$t('TT0003')"
              @click="openDigitalThreadNameEditor"
            )
            f-svg-icon(
              v-if="!isCreatingDigitalThread"
              iconName="summary"
              size="20"
              class="text-grey-600 hover:text-primary-400 cursor-pointer"
              :tooltip="$t('TT0067')"
              @click="openModalDigitalThreadSummary"
            )
        f-svg-icon(
          iconName="clear"
          size="20"
          class="text-grey-600 hover:text-primary-400 ml-4 cursor-pointer"
          tooltip="Close"
          @click="closeStickerDrawer"
        )
      template(v-else)
        f-input-text(v-model:textValue="tempDigitalThreadName" class="flex-grow")
        f-button(
          type="primary"
          size="sm"
          class="ml-3 mr-2"
          :disabled="tempDigitalThreadName === ''"
          @click="saveDigitalThreadName"
        ) {{ $t('UU0018') }}
        f-button(
          type="text"
          size="sm"
          @click="isEditingDigitalThreadName = false"
        ) {{ $t('UU0002') }}
    div(
      class="w-full h-28 px-8 pt-3 pb-2.5 bg-grey-0 drop-shadow-4"
      :key="material.materialId"
    )
      //- Material Info
      div(class="flex items-center gap-x-4")
        img(
          v-defaultImg
          class="flex-shrink-0 w-13 h-13 rounded overflow-hidden"
          :class="{ 'cursor-pointer': !digitalThread.hasMaterialDeleted || !digitalThread.hasMaterialNoAccess }"
          :src="material.coverImg"
          @click="goToMaterialDetail(false)"
        )
        div(class="flex-grow h-11")
          p(
            class="group pb-2 flex items-center text-body2"
            :class="[digitalThread.hasMaterialDeleted || digitalThread.hasMaterialNoAccess ? 'text-grey-200' : 'text-grey-800']"
            @click="goToMaterialDetail(false)"
          )
            span(
              class="font-bold line-clamp-1"
              :class="{ 'hover:text-primary-400 hover:underline hover:cursor-pointer': !digitalThread.hasMaterialDeleted && !digitalThread.hasMaterialNoAccess }"
            ) {{ `#${material.materialNo}` }}
            f-svg-icon(
              v-if="!digitalThread.hasMaterialDeleted && !digitalThread.hasMaterialNoAccess"
              iconName="open_in_new"
              size="14"
              class="ml-1 invisible group-hover:visible text-grey-600 hover:text-primary-400 hover:cursor-pointer"
              @click.stop="goToMaterialDetail(true)"
            )
            span(class="leading-1.4 pl-0.5" v-if="digitalThread.hasMaterialDeleted") ({{ $t('RR0063') }})
            span(
              class="leading-1.4 pl-0.5"
              v-else-if="digitalThread.hasMaterialNoAccess"
            ) ({{ $t('TT0107') }})
          div(class="flex items-center gap-x-2")
            f-avatar(:imageUrl="material.unitLogo" type="org" size="xs")
            span(class="text-caption text-grey-800") {{ material.unitName }}
      //- Filter
      div(class="pt-2.5 flex items-center gap-x-2")
        f-input-select(
          v-model:selectValue="filter.addTo"
          :dropdownMenuTree="menuAddTo"
          class="w-30"
          size="sm"
        )
        div(class="w-px py-2 box-content bg-grey-150")
        //- isStarred
        button(
          class="px-2.5 h-6 rounded-[20px] flex justify-center items-center gap-x-0.5"
          :class="[filter.isStarred ? 'bg-primary-0' : 'bg-grey-100']"
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
            v-if="filter.isStarred"
            class="pl-1 text-caption fond-bold text-primary-500"
          ) {{ digitalThread.stickerStatistics.starredQty }}
        //- Advance Filter Panel
        f-popper(
          placement="bottom"
          :offset="[-17, 8]"
          :disabled="isCreatingDigitalThread"
        )
          template(#trigger="{ isExpand }")
            button(
              :class="{ 'bg-primary-0': isExpand || isAdvanceFilterDirty }"
              class="px-2 h-6 rounded-[20px] bg-grey-100 flex items-center"
            )
              f-svg-icon(
                iconName="filter"
                size="16"
                :class="[isExpand || isAdvanceFilterDirty ? 'text-primary-400' : 'text-grey-800']"
              )
          template(#content="{ collapsePopper }")
            div(class="bg-grey-0 drop-shadow-16 rounded w-93.5 py-4")
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
    //- Content
    f-scrollbar-container(class="flex-grow")
      div(class="py-4")
        //- Button: Add a sticker
        div(v-if="!isAddingSticker && !isFilterDirty" class="pl-8 pr-10.5")
          f-tooltip(placement="top" isNotFitWidth)
            template(#trigger)
              button(
                class="relative w-full h-16 rounded-md overflow-hidden drop-shadow-2"
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
            template(#content v-if="digitalThread.hasMaterialDeleted")
              p {{ $t('TT0102') }}
        //- Default intro
        div(v-if="isCreatingDigitalThread && !isAddingSticker" class="pl-8 pr-10.5")
          div(class="pt-10")
            img(src="@/assets/images/image_sticker_empty.png" class="w-72.5 ml-15")
            i18n-t(
              keypath="TT0004"
              tag="p"
              class="text-h6 font-bold text-grey-300 text-center pb-6"
              scope="global"
            )
              template(#TT0092)
                span(class="text-grey-800") {{ $t('TT0092') }}
            p(class="text-body2 leading-1.6 text-grey-400 text-center") {{ $t('TT0005') }}
        //- State - Normal
        template(v-else)
          div(v-if="isAddingSticker" class="pl-8 pr-7")
            sticker-create(
              :isCreatingDigitalThread="isCreatingDigitalThread"
              :digitalThreadName="digitalThread.digitalThreadName"
              @close="setIsAddingSticker(false)"
            )
          div(class="pt-3 pl-8 pr-10.5 flex flex-col gap-y-3")
            sticker-card(
              v-for="sticker in stickerList"
              :key="sticker.stickerId"
              :sticker="sticker"
            )
  template(v-if="isExpandDigitalThreadList")
    div(class="absolute z-0 top-0 right-0 w-screen h-screen bg-grey-900/30")
    div(
      class="absolute z-0 top-0 right-full w-118.5 h-screen bg-grey-0 border border-grey-150 drop-shadow-8 flex flex-col"
    )
      div(class="w-full h-17.5 px-4.5 border-b border-grey-150 flex items-center gap-x-2")
        f-svg-icon(iconName="sticker_thread" size="20" class="text-grey-900")
        span(class="text-body1 font-bold text-grey-900 whitespace-nowrap") {{ $t('TT0076') }}
        span(class="text-body1 font-bold text-grey-800 line-clamp-1") {{ `#${material.materialNo}` }}
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

<script setup>
import { useStore } from 'vuex'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import StickerCreate from '@/components/sticker/StickerCreate.vue'
import { STICKER_ADD_TO, OG_TYPE, LOCATION_TYPE } from '@/utils/constants'
import StickerCard from '@/components/sticker/StickerCard.vue'
import DigitalThreadCard from '@/components/sticker/DigitalThreadCard.vue'
import useNavigation from '@/composables/useNavigation'
import { useRouter } from 'vue-router'

const store = useStore()
const { t } = useI18n()
const router = useRouter()
const { parsePath } = useNavigation()

const material = computed(() => store.getters['sticker/material'])
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

const isAddingSticker = computed(() => store.getters['sticker/isAddingSticker'])
const setIsAddingSticker = (bool) =>
  store.commit('sticker/SET_isAddingSticker', bool)

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

const openModalDigitalThreadSummary = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-digital-thread-summary',
  })
}

const isExpandDigitalThreadList = ref(false)
const indexOfDrawerDigitalThread = computed(
  () => store.getters['sticker/indexOfDrawerDigitalThread']
)
const digitalThreadList = computed(() =>
  store.getters['sticker/tempDigitalThreadList'].concat(
    store.getters['sticker/digitalThreadList']
  )
)

const startToCreateDigitalThread = () => {
  setIsAddingSticker(false)
  store.dispatch('sticker/startToCreateDigitalThread')
}

const openDigitalThread = async (digitalThread, index) => {
  if (indexOfDrawerDigitalThread.value === index) {
    return
  }
  isChangingDigitalThread.value = true
  setIsAddingSticker(false)
  store.commit('sticker/SET_indexOfDrawerDigitalThread', index)
  store.commit('sticker/RESET_filter')
  const digitalThreadSideId = digitalThread.digitalThreadSideId
  if (digitalThreadSideId === null) {
    // 避免 isChangingDigitalThread 太快被切換回 false 導致 watch handler 被處執行
    setTimeout(() => {
      store.commit('sticker/SET_digitalThread', digitalThread)
      isChangingDigitalThread.value = false
    }, 0)
  } else {
    await store.dispatch('sticker/getDigitalThread', {
      digitalThreadSideId,
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
const isFilterDirty = computed(() => store.getters['sticker/isFilterDirty'])
const isAdvanceFilterDirty = computed(
  () => store.getters['sticker/isAdvanceFilterDirty']
)
watch(
  () => filter.value,
  () => {
    store.commit('sticker/SET_filter', filter.value)
    !isCreatingDigitalThread.value &&
      !isChangingDigitalThread.value &&
      store.dispatch('sticker/getDigitalThread', {
        digitalThreadSideId: digitalThread.value.digitalThreadSideId,
        wllGetAdditionalData: false,
      })
  },
  {
    deep: true,
    flush: 'post', // avoid it be invoked after component unmount
  }
)
const orgName = computed(
  () => store.getters['organization/organization'].orgName
)
const username = computed(
  () => store.getters['organization/orgUser/orgUser'].displayName
)
const inputSearchTagList = ref('')
const sourceTagList = computed(() => store.getters['sticker/sourceTagList'])
const isShowMore = ref(false)
const displayTagList = computed(() => {
  const tagList = sourceTagList.value
    .filter((tag) => tag.includes(inputSearchTagList.value || ''))
    .map((tag) => ({
      isSelect: filter.value.tagList.includes(tag),
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
const toggleTagList = (selectTag) => {
  const index = filter.value.tagList.findIndex((tag) => tag === selectTag)
  if (!~index) {
    filter.value.tagList.push(selectTag)
  } else {
    filter.value.tagList.splice(index, 1)
  }
}

const goToMaterialDetail = (openNewPage = false) => {
  if (
    digitalThread.value.hasMaterialDeleted ||
    digitalThread.value.hasMaterialNoAccess
  ) {
    return
  }
  const {
    isMaterialOwnerSide,
    materialId,
    materialOwnerOGId,
    materialOwnerOGType,
  } = material.value

  if (!isMaterialOwnerSide) {
    return store.dispatch('helper/openModalBehavior', {
      component: 'modal-sticker-material-detail',
      properties: {
        material: material.value,
      },
    })
  }

  const orgNo = store.getters['organization/orgNo']
  let unParsedPath
  if (materialOwnerOGType === OG_TYPE.ORG) {
    unParsedPath = `/${orgNo}/assets/${materialId}`
  } else {
    unParsedPath = `/${orgNo}/${materialOwnerOGId}/assets/${materialId}`
  }

  if (openNewPage) {
    window.open(parsePath(unParsedPath), '_blank')
  } else {
    router.push(parsePath(unParsedPath))
  }
}

const readDigitalThread = (e) => {
  if (!isCreatingDigitalThread.value) {
    const body = {
      orgId: 6,
      digitalThreadSideId: digitalThread.value.digitalThreadSideId,
      accessToken: localStorage.getItem('accessToken'),
    }
    const headers = {
      type: 'application/json',
    }
    const blob = new Blob([JSON.stringify(body)], headers)
    navigator.sendBeacon(
      `https://textile-webapi-dev.frontier.cool/v2.1.0/digital-thread/read-new-add-and-update`,
      blob
    )
  }
}
onMounted(() => {
  window.addEventListener('beforeunload', readDigitalThread)
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', readDigitalThread)
  readDigitalThread()
})

const closeStickerDrawer = () => {
  store.dispatch('sticker/closeStickerDrawer')
}
</script>
